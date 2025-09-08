import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket'
import { constructAgentApiRequest, constructAgentAuthRequest } from './agent'
import { decryptMessage } from '../../util/non-bc-crypto/decryptMessage'
import {
  generateX25519KeyPair,
  X25519KeyPair,
} from '../../util/non-bc-crypto/generateX25519KeyPair'
import { processDiffieHellmanAuth } from '../../util/non-bc-crypto/processDiffieHellmanAuth'
import { LockState, MinerSpecs, MinerUsageData } from '../../types/agent'
import { UserMiner } from '../parachain/useWorkersQuery'

const CYBORG_SERVER_URL = process.env.REACT_APP_CYBORG_PROXY_URL

export const useAgentCommunication = (miner: UserMiner) => {
  const navigate = useNavigate()

  const [keys, setKeys] = useState<X25519KeyPair | null>(null)
  const [agentUrl, setAgentUrl] = useState<string | null>(null)
  const [diffieHellmanSecret, setDiffieHellmanSecret] =
    useState<Uint8Array | null>(null)
  const [usageData, setUsageData] = useState<MinerUsageData>({
    CPU: [],
    RAM: [],
    DISK: [],
    timestamp: [],
    zkStage: 0,
  })
  const [agentSpecs, setAgentSpecs] = useState<MinerSpecs | null>(null)
  const [logs, setLogs] = useState<string[]>([''])
  const [lockState, setLockState] = useState<LockState>({
    isLocked: true,
    isLoading: false,
  })

  useEffect(() => {
    if (miner) {
      setAgentUrl(`${miner.api.asText().replace('https://', 'wss://')}/agent-usage`)
    }
  }, [miner])

  const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  const { sendMessage } = useWebSocket(agentUrl, {
    shouldReconnect: () => !!agentUrl,
    onOpen: () => {
      console.log('Connection with cyborg-agent established')
    },
    onMessage: async message => {
      const messageData = JSON.parse(message.data)

      switch (messageData.response_type) {
        case 'Usage': {
          const usageJson = await decryptMessage(
            messageData.encrypted_data_hex,
            messageData.nonce_hex,
            diffieHellmanSecret
          )
          const usage = JSON.parse(usageJson)
          const now = new Date().toLocaleString()
          setUsageData(prev => ({
            CPU: [...prev.CPU, usage.cpu_usage],
            RAM: [...prev.RAM, usage.mem_usage], // in bytes
            DISK: [...prev.DISK, usage.disk_usage], // in bytes
            timestamp: [...prev.timestamp, now],
            zkStage: usage.zk_stage,
          }))
          setLogs(usage.recent_logs.split('\n'))
          break
        }
        case 'Init': {
          const initJson = await decryptMessage(
            messageData.encrypted_data_hex,
            messageData.nonce_hex,
            diffieHellmanSecret
          )
          const init = JSON.parse(initJson)
          setAgentSpecs(init)
          break
        }
        case 'Auth': {
          const decryptionKey = await processDiffieHellmanAuth(
            messageData.node_public_key,
            keys.privateKey
          )
          setDiffieHellmanSecret(decryptionKey)
          break
        }
        case 'Test': {
          console.warn('Received test message from cyborg-agent.')
          break
        }
        case 'Error': {
          if (messageData.error_type && messageData.error_type === 'Auth') {
            for (let i = 0; i < 8; i++) {
              if (diffieHellmanSecret) {
                return
              }
              await sleep(5000)
              if (diffieHellmanSecret) {
                return
              }
              authenticateWithAgent()
            }
            toast(`${messageData.error_message} Returning to dashboard.`)
            setTimeout(() => navigate(-1), 3000)
          } else {
            const errorJson = await decryptMessage(
              messageData.encrypted_data_hex,
              messageData.nonce_hex,
              diffieHellmanSecret
            )
            console.log(errorJson)
            if(!errorJson) break
            const error = JSON.parse(errorJson)
            toast(error.error_message)
          }
          break
        }
        default: {
          console.warn('Recieved unknown message from cyborg-agent.')
        }
      }
    },
    onError: () => {
      toast(
        'This miners agent encountered an unrecoverable error. Closing the lock...'
      )
      setLockState({ isLocked: true, isLoading: false })
    },
  }, !!agentUrl);

  useEffect(() => {
    if (diffieHellmanSecret) {
      sendMessage(
        constructAgentApiRequest(agentUrl, 'Init')
      )
    }
  }, [diffieHellmanSecret, miner, sendMessage, agentUrl])

  useEffect(() => {
    if (agentSpecs) {
      setLockState({ isLoading: false, isLocked: false })
      sendMessage(
        constructAgentApiRequest(agentUrl, 'Usage')
      )
    }
  }, [agentSpecs, miner, sendMessage, agentUrl])

  useEffect(() => {
    let isMounted = true

    const keyGen = async () => {
      if (CYBORG_SERVER_URL) {
        const keypair = await generateX25519KeyPair()
        if (isMounted) {
          setKeys(keypair)
        }
      }
    }
    keyGen()

    return () => {
      isMounted = false
    }
  }, [])

  const authenticateWithAgent = () => {
    const sendAuthMessage = async () => {
      try {
        const message = await constructAgentAuthRequest(
          agentUrl,
          miner.lastTask,
          keys.publicKey
        )
        console.log(message)
        sendMessage(message)
        setLockState({ ...lockState, isLoading: true })
      } catch (e) {
        toast('Error sending auth message. Cannot get usage data.')
        setLockState({ isLocked: true, isLoading: false })
      }
    }
    if (keys) {
      sendAuthMessage()
    }
  }

  return { usageData, agentSpecs, logs, lockState, authenticateWithAgent }
}

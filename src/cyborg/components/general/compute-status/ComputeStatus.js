import React, { useEffect, useState } from 'react'
import RenderChart from './RenderChart'
//import { useCyborgState } from '../../../CyborgContext'
import GaugeDisplay from './GaugeDisplay'
import MetaDataHeader from './MetaDataHeader'
import axios from 'axios'
import { data1, data2, data3 } from '../../../data/MockData'
import { useParams } from 'react-router-dom'
import { useCyborg } from '../../../CyborgContext'
import { NodeInformation } from './NodeInformation'
import { ServerSpecs } from './ServerSpecs'
import { Terminal } from './Terminal'
import { useUi } from '../../../context/UiContext'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket'
import { toast } from 'react-hot-toast'
import { signMessageWithWallet } from '../../../util/non-bc-crypto/signMessageWithWallet'
import { processAuthMessage } from '../../../util/non-bc-crypto/processAuthMessage'
import { decryptMessage } from '../../../util/non-bc-crypto/decryptMessage'
import { generateX25519KeyPair } from '../../../util/non-bc-crypto/generateX25519KeyPair'
import sodium from 'libsodium-wrappers'

//const AGENT_URL = undefined // 'ws://138.2.181.77:120'
const CYBORG_SERVER_URL = 'wss://server.cyborgnetwork.io';

export default function ComputeStatus({ perspective }) {
  const { workersWithLastTasks } = useCyborg()
  const { sidebarIsActive } = useUi()

  const { domain } = useParams()

  // const { taskMetadata } = useCyborgState()
  // const [taskId, setTaskId] = useState(taskMetadata && taskMetadata.taskId? taskMetadata.taskId : "");
  // const [link, setLink] = useState(metadata && metadata.api? metadata.api.domain : "");
  const [metadata, setMetadata] = useState(null)
  const [specs, setSpecs] = useState()
  const [metrics, setMetrics] = useState()
  const [selectedGauge, setSelectedGauge] = useState({
    name: 'CPU',
    color: 'var(--gauge-red)',
    data: data1,
  }) //"CPU || "RAM" || "DISK"
  const [agentSpecs, setAgentSpecs] = useState(null);
  const [usageData, setUsageData] = useState([]);

  //TODO store in a real location
  const [keys, setKeys] = useState(null);
  const [diffieHellmanSecret, setDiffieHellmanSecret] = useState(null)

  const { sendMessage } = useWebSocket(CYBORG_SERVER_URL, {
    onOpen: () => {
      toast("Connection established")
    },
    onMessage: async (message) => {

      const messageData = message.data

      if(messageData.startsWith("AUTH|")){
        const decryptionKey = await processAuthMessage(messageData, keys.privateKey); 
        setDiffieHellmanSecret(decryptionKey);
      } else if(messageData.startsWith("INIT|")){
        const init = await decryptMessage(messageData, diffieHellmanSecret);
        setAgentSpecs(init)
      } else if(messageData.startsWith("USAGE")){
        const usageJson = await decryptMessage(messageData, diffieHellmanSecret);
        const usage = JSON.parse(usageJson);

        const now = new Date().toLocaleString()

        const usageWithTimestamp = {...usage, ['timestamp']: now };

        setUsageData([...usageData, usageWithTimestamp]);
        console.log(usageData)
      } else {
        //TODO: remove this
        setAgentSpecs(true);
        console.log('Received unknown ws message type.')
        toast(messageData)
      }
    }
  });

  const constructMessage = (messageData) => {
  
    const message = JSON.stringify({
      target_ip: "138.2.181.77",
      data: messageData
    })

    return message
  }

  useEffect(() => {
    if(diffieHellmanSecret){
      sendMessage(constructMessage("INIT"));
    }
  }, [diffieHellmanSecret])

  useEffect(() => {
    if(agentSpecs){
      sendMessage(constructMessage("USAGE"));
    }
  }, [agentSpecs])

  useEffect( async () => {
    if(CYBORG_SERVER_URL){
      const keypair = await generateX25519KeyPair()
      setKeys(keypair)
    }
  }, [])

  useEffect(() => {
    const sendAuthMessage = async () => {
      try{
        const { wrappedMessage, signature } = await signMessageWithWallet();
        const messageData = `AUTH|${wrappedMessage}|${signature}|${sodium.to_hex(keys.publicKey)}`
        sendMessage(constructMessage(messageData));
      } catch(e) {
        toast("Error sending auth message. Cannot get usage data.")
      }
    }
    if(keys){
      sendAuthMessage()
    }
  }, [keys])

  const handleSetSelectedGauge = (name, color) => {
    let data
    switch (name) {
      case 'CPU':
        data = data1
        break
      case 'DISK':
        data = data2
        break
      case 'RAM':
        data = data3
        break
    }

    setSelectedGauge({ name: name, color: color, data: data })
  }

  useEffect(() => {
    //This is necessary because if the user tries to share a link to the current node, it will not have the data otherwise
    const getCurrentWorker = () =>
      workersWithLastTasks.filter(node => {
        if (node.api.domain === domain) {
          setMetadata(node)
        }
      })
    if (workersWithLastTasks) getCurrentWorker()
  }, [workersWithLastTasks, setMetadata])

  useEffect(() => {
    const fetchSpecs = async () => {
      try {
        const specRes = await axios.get(
          `${process.env.REACT_APP_HTTP_PREFIX}://${metadata.api.domain}/system-specs`
        )
        setSpecs(specRes.data)
      } catch (error) {
        console.error('SPECS ERROR:: ', error)
      }
    }
    if (metadata) {
      if (metadata.api.domain) fetchSpecs()
    }
  }, [metadata])

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metricRes = await axios.get(
          `${process.env.REACT_APP_HTTP_PREFIX}://${metadata.api.domain}/consumption-metrics`
        )
        setMetrics(metricRes.data)
      } catch (error) {
        console.error('METRICS ERROR:: ', error)
      }
    }
    if (metadata) {
      if (metadata.api.domain) fetchMetrics()
    }
  }, [metadata])

  console.log('specs: ', specs)
  console.log('metrics: ', metrics)
  // let taskId = taskMetadata? taskMetadata.taskId : null;
  // useEffect(()=>{
  //   const route = `${metadata.api.domain}`
  //   if (taskMetadata) {
  //     setTaskId(taskMetadata.taskId)
  //     setLink(route)
  //   }
  // },[taskMetadata])
  console.log('metadata: ', metadata)

  // TODO: Retrieve Server Usage Specs to replace gauge values
  return (
    <div
      className={`w-screen mt-6 mb-20 self-start px-4 sm:px-6 lg:px-16 flex flex-col gap-10 ${
        sidebarIsActive ? 'lg:pl-96' : 'lg:pl-16'
      } transition-all duration-500 ease-in-out`}
    >
      {metadata ? (
        <>
          <MetaDataHeader
            owner={metadata.owner}
            id={metadata.id}
            domain={metadata.api.domain}
            status="active"
            lastCheck="96, 21:45:00"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 text-white w-full">
            {perspective === 'provider' ? (
              <div className="col-span-1">
                <NodeInformation />
              </div>
            ) : (
              <></>
            )}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <ServerSpecs spec={specs} metric={metrics} uptime={64} />
            </div>
            <div
              className={`col-span-1 md:col-span-2 ${
                perspective !== 'provider' ? '' : ''
              }`}
            >
              <Terminal link={metadata.api.domain} taskId={metadata.lastTask} />
            </div>
            {metrics && (
              <>
                <div className="col-span-1">
                  <GaugeDisplay
                    setAsSelectedGauge={handleSetSelectedGauge}
                    selectedGauge={selectedGauge}
                    percentage={
                      metrics && metrics.cpuUsage
                        ? Number(metrics.cpuUsage.usage.slice(0, -1))
                        : 1
                    }
                    fill={'var(--gauge-red)'}
                    name={'CPU'}
                    styleAdditions={'ring-gauge-red bg-gauge-red'}
                  />
                </div>
                <div className="col-span-1">
                  <GaugeDisplay
                    setAsSelectedGauge={handleSetSelectedGauge}
                    selectedGauge={selectedGauge}
                    percentage={
                      metrics && metrics.memoryUsage
                        ? Number(metrics.memoryUsage.usage.slice(0, -1))
                        : 1
                    }
                    fill={'var(--gauge-green)'}
                    name={'RAM'}
                    styleAdditions={'ring-gauge-green bg-gauge-green'}
                  />
                </div>
                <div className="col-span-1">
                  <GaugeDisplay
                    setAsSelectedGauge={handleSetSelectedGauge}
                    selectedGauge={selectedGauge}
                    percentage={
                      metrics && metrics.diskUsage
                        ? Number(metrics.diskUsage[0]['use%'].slice(0, -1))
                        : 1
                    }
                    fill={'var(--gauge-yellow)'}
                    name={'DISK'}
                    styleAdditions={'ring-gauge-yellow bg-gauge-yellow'}
                  />
                </div>
              </>
            )}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <RenderChart
                metric={"CPU"}
                data={usageData}
                color={selectedGauge.color}
              />
            </div>
          </div>
        </>
      ) : (
        <div>Loading</div>
      )}
    </div>
  )
}

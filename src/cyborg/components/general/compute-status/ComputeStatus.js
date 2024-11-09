import React, { useEffect, useState } from 'react'
import RenderChart from './RenderChart'
//import { useCyborgState } from '../../../CyborgContext'
import GaugeDisplay from './GaugeDisplay'
import MetaDataHeader from './MetaDataHeader'
import axios from 'axios'
import { data1, data2, data3 } from '../../../data/MockData'
import { useNavigate, useParams } from 'react-router-dom'
import { useCyborg } from '../../../CyborgContext'
import { NodeInformation } from './NodeInformation'
import { ServerSpecs } from './ServerSpecs'
import { Terminal } from './Terminal'
import { useUi } from '../../../context/UiContext'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket'
import { toast } from 'react-hot-toast'
import { processAuthMessage } from '../../../util/non-bc-crypto/processAuthMessage'
import { decryptMessage } from '../../../util/non-bc-crypto/decryptMessage'
import { generateX25519KeyPair } from '../../../util/non-bc-crypto/generateX25519KeyPair'
import { constructAgentApiRequest, constructAgentAuthRequest } from '../../../api/agent'
import SigntoUnlockModal from '../modals/SignToUnlock'
import { Stepper, Step } from 'react-form-stepper';

const CYBORG_SERVER_URL = 'wss://server.cyborgnetwork.io/ws/';

export default function ComputeStatus({ perspective }) {
  const { workersWithLastTasks } = useCyborg()
  const { sidebarIsActive } = useUi()

  const { domain } = useParams()

  const navigate = useNavigate();

  // const { taskMetadata } = useCyborgState()
  // const [taskId, setTaskId] = useState(taskMetadata && taskMetadata.taskId? taskMetadata.taskId : "");
  // const [link, setLink] = useState(metadata && metadata.api? metadata.api.domain : "");
  const [metadata, setMetadata] = useState(null)
  const [specs, setSpecs] = useState()
  const [metrics, setMetrics] = useState()
  const [lockState, setLockState] = useState({isLocked: true, isLoading: false});
  const [selectedGauge, setSelectedGauge] = useState({
    name: 'CPU',
    color: 'var(--gauge-red)',
    data: data1,
  }) //"CPU || "RAM" || "DISK"
  const [agentSpecs, setAgentSpecs] = useState(null);
  const [usageData, setUsageData] = useState({CPU: [], RAM: [], DISK: [], timestamp: [], zkStage: 0});
  const [logs, setLogs] = useState("");

  //TODO store in a real location
  const [keys, setKeys] = useState(null);
  const [diffieHellmanSecret, setDiffieHellmanSecret] = useState(null)

  const { sendMessage } = useWebSocket(CYBORG_SERVER_URL, {
    onOpen: () => {
      console.log("Connection established")
    },
    onMessage: async (message) => {

      const messageData = JSON.parse(message.data)

      switch (messageData.response_type) {
        case "Usage": {
          const usageJson = await decryptMessage(messageData.encrypted_data_hex, messageData.nonce_hex, diffieHellmanSecret) 
          const usage = JSON.parse(usageJson);
          const now = new Date().toLocaleString();
          setUsageData(prev => ({
            CPU: [...prev.CPU, usage.cpu_usage], 
            RAM: [...prev.RAM, usage.mem_usage], // in bytes
            DISK: [...prev.DISK, usage.disk_usage], // in bytes
            timestamp: [...prev.timestamp, now],
            zkStage: usage.zk_stage
          }))
          setLogs(prev => [...prev, ...usage.recent_logs])
          break;
        }
        case "Init": {
          const initJson = await decryptMessage(messageData.encrypted_data_hex, messageData.nonce_hex, diffieHellmanSecret);
          const init = JSON.parse(initJson);
          setAgentSpecs(init);
          break;
        }
        case "Auth": {
          const decryptionKey = await processAuthMessage(messageData.node_public_key, keys.privateKey);
          setDiffieHellmanSecret(decryptionKey);
          break;
        }
        case "Test": {
          console.warn("Received test message from cyborg-agent.");
          break;
        }
        case "Error": {
          if(messageData.error_type && messageData.error_type === "Auth"){
            toast(`${messageData.error_message} Returning to dashboard.`);
            setTimeout(() => navigate(-1), 3000);
          } else {
            const errorJson = await decryptMessage(messageData.encrypted_data_hex, messageData.nonce_hex, diffieHellmanSecret);
            const error = JSON.parse(errorJson);
            toast(error.error_message);
          }
          break;
        }
        default: {
          console.warn("Recieved unknown message from cyborg-agent.")
        }
      }
    },
    onError: () => {
      toast("This nodes agent encountered an unrecoverable error. Closing the lock...")
    }
  });

  useEffect(() => {
    console.log(logs)
  }, [logs])

  const transformUsageDataToChartData = (usageType) => {
    console.log(`Transforming data for ${usageType}`)
    let truncatedUsageData;

    const truncateUsageData = (usageTypeArray) => {
      if(usageData.timestamp.length > 10){
        truncatedUsageData = {
          timestamp: usageData.timestamp.slice(-10),
          [`${usageType}`]: usageTypeArray.slice(-10),
        }
      } else{
        truncatedUsageData = usageData;
      } 
    }

    switch (usageType) {
      case 'CPU':
        truncateUsageData(usageData.CPU)
        return {
          yUnits: {name: "%", max: 100},
          data: truncatedUsageData.CPU.map((value, index) => ({
            x: truncatedUsageData.timestamp[index],
            y: value
          })),
        }
      case 'RAM':
        truncateUsageData(usageData.RAM)
        return {
          yUnits: {name: "MB", max: agentSpecs.specs.memory / 1024 / 1024},
          data: truncatedUsageData.RAM.map((value, index) => ({
            x: truncatedUsageData.timestamp[index],
            y: value / 1024 / 1024 // display memory in MB
          })),
        }
      case 'DISK':
        truncateUsageData(usageData.DISK)
        return {
          yUnits: {name: "GB", max: agentSpecs.specs.disk / 1024 / 1024 / 1024},
          data: truncatedUsageData.DISK.map((value, index) => ({
            x: truncatedUsageData.timestamp[index],
            y: value / 1024 / 1024 / 1024 // display storage in GB
          })),
        }
      default:
        return [];
    }
  }

  useEffect(() => {
    console.warn(agentSpecs);
  }, [agentSpecs])

  useEffect(() => {
    if(diffieHellmanSecret){
      sendMessage(constructAgentApiRequest(metadata.api.domain.split(':')[0], "Init"));
    }
  }, [diffieHellmanSecret])

  useEffect(() => {
    if(agentSpecs){
      setLockState({isLoading: false, isLocked: false})
      sendMessage(constructAgentApiRequest(metadata.api.domain.split(':')[0], "Usage"));
    }
  }, [agentSpecs])

  useEffect( async () => {
    if(CYBORG_SERVER_URL){
      const keypair = await generateX25519KeyPair()
      setKeys(keypair)
    }
  }, [])

  const authenticateWithAgent = () => {
    const sendAuthMessage = async () => {
      try{
        const message =  await constructAgentAuthRequest(metadata.api.domain.split(':')[0], metadata.lastTask, keys.publicKey);
        sendMessage(message);
        setLockState({...lockState, isLoading: true})
      } catch(e) {
        toast("Error sending auth message. Cannot get usage data.")
      }
    }
    if(keys){
      sendAuthMessage()
    }
  }

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

  const parseGaugeMetric = (usageDataArray, totalUsageAvailable, type) => {
    let current = usageDataArray[usageDataArray.length -1];
    console.log(`${type} total ${totalUsageAvailable}`)
    console.log(`${type} current ${current}`)
    if(totalUsageAvailable){
      let percentage = (current / totalUsageAvailable) * 100;
      return Number(parseFloat(percentage.toFixed(2)));
    } else {
      return Number(parseFloat(current.toFixed(2)));
    }
  }

  useEffect(() => {
    console.log(usageData)
  }, [usageData])

  // TODO: Retrieve Server Usage Specs to replace gauge values
  return (
    <>
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
            lastCheck="96, 21:45:39"
          />
          <div className='text-white w-full bg-cb-gray-600 flex rounded-lg gap-4 items-center'>
            <div className='pl-24 text-white text-lg w-fit'>ZK Progress</div> 
            <div className='flex-grow'>
              <Stepper activeStep={usageData.zkStage} 
                  connectorStateColors={true}
                  connectorStyleConfig={{
                    activeColor: "#15e84c",
                    completedColor: "#32b054",
                    disabledColor: "#343735",
                  }}
                  styleConfig={{
                    activeBgColor: "#15e84c",
                    completedBgColor: "#32b054",
                    inactiveBgColor: "#343735",
                    activeTextColor: "#ffffff"
                  }}
              >
                <Step label="Setup Complete" />
                <Step label="Proof Generated" />
                <Step label="Proof Submitted" />
                <Step label="Proof Verified" />
              </Stepper>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 text-white w-full">
            {perspective === 'provider' ? (
              <div className="col-span-1">
                <NodeInformation />
              </div>
            ) : (
              <></>
            )}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <ServerSpecs specs={agentSpecs} metric={metrics} uptime={64} />
            </div>
            <div
              className={`col-span-1 md:col-span-2 ${
                perspective !== 'provider' ? '' : ''
              }`}
            >
              <Terminal link={metadata.api.domain} logs={logs} taskId={metadata.lastTask} />
            </div>
            {usageData && (
              <>
                <div className="col-span-1">
                  <GaugeDisplay
                    setAsSelectedGauge={handleSetSelectedGauge}
                    selectedGauge={selectedGauge}
                    percentage={
                      usageData && usageData.CPU.length > 0
                        ? parseGaugeMetric(usageData.CPU, null, "CPU")
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
                      usageData && usageData.RAM.length > 0
                        ? parseGaugeMetric(usageData.RAM, agentSpecs.specs.memory, "RAM")
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
                      usageData && usageData.DISK.length > 0
                        ? parseGaugeMetric(usageData.DISK, agentSpecs.specs.disk, "DISK")
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
                metric={selectedGauge.name}
                data={transformUsageDataToChartData(selectedGauge.name)}
                color={selectedGauge.color}
              />
            </div>
          </div>
        </>
      ) : (
        <div>Loading</div>
      )}
    </div>
    {lockState.isLocked
      ? <SigntoUnlockModal 
          text={'For privacy reasons, only the user who is currently in control of the worker is allowed to view the workers usage. Please confirm your identity with your public key.'}
          onClick={authenticateWithAgent}
          loading={lockState.isLoading}
        />
      : <></>
    }
    </>
  )
}

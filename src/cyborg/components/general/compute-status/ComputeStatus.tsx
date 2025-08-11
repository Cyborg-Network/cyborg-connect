import React, { useEffect, useState } from 'react'
import RenderChart from './RenderChart'
import GaugeDisplay from './GaugeDisplay'
import MetaDataHeader from './MetaDataHeader'
import { useParams } from 'react-router-dom'
import { NodeInformation } from './NodeInformation'
import { ServerSpecs } from './ServerSpecs'
import { Terminal } from './Terminal'
import { useUi } from '../../../context/UiContext'
import SigntoUnlockModal from '../modals/SignToUnlock'
import { useAgentCommunication } from '../../../api/agent/useAgentCommunication'
import { parseGaugeMetric } from './util'
import { useUserWorkersQuery } from '../../../api/parachain/useWorkersQuery'
import { MetricName, SelectedGaugeState } from '../../../types/compute_status'
import { Data } from '../Chart'
import { Step, Stepper } from 'react-form-stepper'
import Button from '../buttons/Button'
import useTransaction from '../../../api/parachain/useTransaction'
import toast from 'react-hot-toast'
import { useSubstrateState } from '../../../../substrate-lib'
import useService, { SERVICES } from '../../../hooks/useService'

interface ComputeStatusProps {
  perspective: 'provider' | 'accessor'
}

const defaultData: Data = {
  yUnits: { name: '%', max: 100 },
  data: { x: 0, y: 0 },
}

const ComputeStatus: React.FC<ComputeStatusProps> = ({
  perspective,
}: ComputeStatusProps) => {
  const { sidebarIsActive } = useUi()
  const { service } = useService()
  const { domain } = useParams()
  const { api, currentAccount } = useSubstrateState()

  const [metadata, setMetadata] = useState(null)
  const [selectedGauge, setSelectedGauge] = useState<SelectedGaugeState>({
    name: 'CPU',
    color: 'var(--gauge-red)',
    data: defaultData,
  })
  const [proofStage, setProofStage] = useState<number>(0);
  const [proofRequested, setProofRequested] = useState<boolean>(false);

  const { usageData, agentSpecs, logs, lockState, authenticateWithAgent } =
    useAgentCommunication(metadata)

  useEffect(() => {
    if (usageData) {
      console.log('usageData: ', usageData)
    }
  }, [usageData])

  useEffect(() => {
    if (agentSpecs) {
      console.log('agentSpecs: ', agentSpecs)
    }
  }, [agentSpecs])

  const {
    data: executableWorkers,
    //isLoading: executableWorkersIsLoading,
    //error: executableWorkersError
  } = useUserWorkersQuery(false, 'executableWorkers')

  const {
    data: workerClusters,
    //isLoading: workerClustersIsLoading,
    //error: workerClustersError
  } = useUserWorkersQuery(false, 'workerClusters')

  useEffect(() => {
   async function queryProofStage() {
    if(metadata){
    if(metadata.lastTask){
      
    const task = await api.query.taskManagement.tasks(metadata.lastTask);

    console.log(task)

    if(task.nzkData){
      if (task.nzkData.zkProof && !task.nzkData.lastProofAccepted) {
        setProofStage(2)
        return;
      }
    }

    if(task.nzkData){
      if (task.nzkData.lastProofAccepted) {
        setProofStage(3)
        return;
      }
    }
    }
  }
   } 

   queryProofStage();
  }, [metadata])

  const transformUsageDataToChartData = (usageType: MetricName): Data => {
    let truncatedUsageData

    const truncateUsageData = usageTypeArray => {
      if (usageData.timestamp.length > 10) {
        truncatedUsageData = {
          timestamp: usageData.timestamp.slice(-10),
          [`${usageType}`]: usageTypeArray.slice(-10),
        }
      } else {
        truncatedUsageData = usageData
      }
    }

    switch (usageType) {
      case 'CPU':
        truncateUsageData(usageData.CPU)
        return {
          yUnits: { name: '%', max: 100 },
          data: truncatedUsageData.CPU.map((value, index) => ({
            x: truncatedUsageData.timestamp[index],
            y: value,
          })),
        }
      case 'RAM':
        truncateUsageData(usageData.RAM)
        return {
          yUnits: { name: 'MB', max: agentSpecs.specs.memory / 1024 / 1024 },
          data: truncatedUsageData.RAM.map((value, index) => ({
            x: truncatedUsageData.timestamp[index],
            y: value / 1024 / 1024, // display memory in MB
          })),
        }
      case 'DISK':
        truncateUsageData(usageData.DISK)
        return {
          yUnits: { name: 'GB', max: agentSpecs.specs.disk / 1024 / 1024 / 1024 },
          data: truncatedUsageData.DISK.map((value, index) => ({
            x: truncatedUsageData.timestamp[index],
            y: value / 1024 / 1024 / 1024, // display storage in GB
          })),
        }
      default:
        return defaultData
    }
  }

  const handleSetSelectedGauge = (name: MetricName, color: string) => {
    let data: Data
    switch (name) {
      case 'CPU':
        data = defaultData
        break
      case 'DISK':
        data = defaultData
        break
      case 'RAM':
        data = defaultData
        break
      default:
        break
    }
    setSelectedGauge({ name: name, color: color, data: data })
  }

  useEffect(() => {
    if (!executableWorkers || !workerClusters) return
    //This is necessary because if the user tries to share a link to the current node, it will not have the data otherwise
    const currentWorker = [...executableWorkers, ...workerClusters].find(
      node => node.api.domain === `https://${domain}`
    )
    if (currentWorker) {
      setMetadata(currentWorker)
    }
  }, [executableWorkers, workerClusters, setMetadata, domain])

  const { handleTransaction, isLoading } = useTransaction(api)

  const requestProof = async (taskId: number) => {
    const tx = api.tx.neuroZk.requestProof(taskId)

    await handleTransaction({
      tx,
      account: currentAccount,
      onSuccess: events => {
        console.log('Proof sucessfully requested!', events);
        setProofStage(1);
        setProofRequested(true)
        pollTaskStatus(taskId, api, setProofStage);
      },
      onError: error => toast('Transaction Failed:', error),
    })
  }

  function getProofStageFromTask(task: any): number {
    console.log("Nzk data", task.nzkData);
    if (!task || !task.nzkData) return 0;

    const { zkProof, lastProofAccepted } = task.nzkData;

    if (lastProofAccepted?.[0]) return 3;
    if (zkProof) return 2;

    if ( proofRequested ) {
      return 1;
    } else {
      return 0;
    }
  }

  useEffect(() => {
    if (!api || !metadata) {
      return;
    }

    if (metadata.lastTask == null || metadata.lastTask === undefined) {
      return;
    }

    const cleanup = pollTaskStatus(api, metadata.lastTask, setProofStage);
    return () => cleanup();
  }, [api, metadata]);

  function pollTaskStatus(api: any, taskId: number, setProofStage: (n: number) => void): () => void {
    console.log('Starting pollTaskStatus for taskId:', taskId);
    let intervalId = setInterval(async () => {
      console.log('Polling task status for taskId:', taskId);
      try {
        const taskRaw = await api.query.taskManagement.tasks(taskId);
        console.log('Raw task value:', taskRaw);
        const task = taskRaw.toJSON();
        console.log('Parsed task value:', task);
        const newStage = getProofStageFromTask(task);

        if (proofStage !== newStage) {
          setProofStage(newStage);
        }

        if (newStage === 3) {
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }


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
              taskId={metadata.lastTask}
              id={metadata.id}
              domain={metadata.api.domain}
              status={metadata.status}
              lastCheck={metadata.statusLastUpdated}
            />
            {
              service === SERVICES.NZK
              ?
              <div className="text-white w-full bg-cb-gray-600 flex rounded-lg gap-4 items-center">
                <Button
                  onClick={() => requestProof(metadata.lastTask)}
                  type="button"
                  variation="primary"
                  selectable={false}
                  additionalClasses="ml-10"
                >
                  {isLoading ? 'Requesting Proof...' : 'Request Proof'}
                </Button>
                <div className='flex-grow'>
                  <Stepper activeStep={proofStage} 
                      connectorStateColors={true}
                      connectorStyleConfig={{
                        size: ".5em",
                        activeColor: "#15e84c",
                        completedColor: "#32b054",
                        disabledColor: "#343735",
                        style: ""
                      }}
                      styleConfig={{
                        completedTextColor: "#ffffff",
                        inactiveTextColor: "#ffffff",
                        size: "3em",
                        fontWeight: "regular",
                        labelFontSize: "0.9em",
                        circleFontSize: "1em",
                        borderRadius: "50%",
                        activeBgColor: "#15e84c",
                        completedBgColor: "#32b054",
                        inactiveBgColor: "#343735",
                        activeTextColor: "#ffffff"
                      }}
                  >
                    <Step label="Setup Complete" />
                    <Step label="Proof Requested" />
                    <Step label="Proof Submitted" />
                    <Step label="Proof Verified" />
                  </Stepper>
                </div>
              </div>
              :
              <></>
            }
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 text-white w-full">
              {perspective === 'provider' ? (
                <div className="col-span-1">
                  <NodeInformation />
                </div>
              ) : (
                <></>
              )}
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <ServerSpecs specs={agentSpecs} uptime={64} />
              </div>
              <div
                className={`col-span-1 md:col-span-2 ${
                  perspective !== 'provider' ? '' : ''
                }`}
              >
                <Terminal
                  link={metadata.api.domain}
                  logs={logs}
                  taskId={metadata.lastTask}
                />
              </div>
              {usageData && (
                <>
                  <div className="col-span-1">
                    <GaugeDisplay
                      setAsSelectedGauge={handleSetSelectedGauge}
                      selectedGauge={selectedGauge}
                      percentage={
                        usageData && usageData.CPU.length > 0
                          ? parseGaugeMetric(usageData.CPU, null)
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
                          ? parseGaugeMetric(usageData.RAM, agentSpecs.specs.memory)
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
                          ? parseGaugeMetric(usageData.DISK, agentSpecs.specs.disk)
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
      {lockState.isLocked ? (
        <SigntoUnlockModal
          text={
            'For privacy reasons, only the user who is currently in control of the worker is allowed to view the miners usage. Please confirm your identity with your public key.'
          }
          onClick={authenticateWithAgent}
          loading={lockState.isLoading}
        />
      ) : (
        <></>
      )}
    </>
  )
}

export default ComputeStatus

import React, { useEffect, useState } from 'react'
import RenderChart from './RenderChart'
//import { useCyborgState } from '../../../CyborgContext'
import GaugeDisplay from './GaugeDisplay'
import axios from 'axios'
import { data1, data2, data3 } from '../../../data/MockData'
import { useParams } from 'react-router-dom'
import { useCyborg } from '../../../CyborgContext'
import { NodeInformation } from './NodeInformation'
import { ServerSpecs } from './ServerSpecs'
import { Terminal } from './Terminal'

export default function ComputeStatus({ perspective }) {
  const { workersWithLastTasks } = useCyborg()

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
          `http://${metadata.api.domain}/system-specs`
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
          `http://${metadata.api.domain}/consumption-metrics`
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
    <div className="h-screen bg-cb-gray-700 flex flex-col overflow-scroll">
      {metadata ? (
        <>
          <div className="flex items-center justify-between mx-2 text-white p-4 px-14">
            <div className="flex items-end gap-2 text-xl">
              <div>Node Name: </div>
              <div className="text-cb-green">
                {metadata.owner}:{metadata.id}
              </div>
            </div>
            <div className="flex items-end gap-2 text-md">
              <div className="text-opacity-50 text-white">IP Address: </div>
              <div>{metadata.api.domain}</div>
            </div>
          </div>
          <div className="grid grid-col-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 p-2 px-16 text-white">
            {perspective === 'provider' ? <NodeInformation /> : <></>}
            <ServerSpecs spec={specs} metric={metrics} />
            <div
              className={`${perspective !== 'provider' ? 'col-span-2' : ''}`}
            >
              <Terminal link={metadata.api.domain} taskId={metadata.lastTask} />
            </div>
            {metrics && (
              <>
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
              </>
            )}
            <RenderChart
              metric={selectedGauge.name}
              data={selectedGauge.data}
              color={selectedGauge.color}
            />
          </div>
        </>
      ) : (
        <div>Loading</div>
      )}
    </div>
  )
}

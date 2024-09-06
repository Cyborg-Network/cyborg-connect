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

  const truncateAddress = (address) => {
      if(window.innerWidth < 600) {
        return `${address.slice(0,6)}...${address.slice(-6)}`
      } else {
        return address
      }
  }

  // TODO: Retrieve Server Usage Specs to replace gauge values
  return (
    <div className='mt-5 mb-20 mx-4 flex flex-col gap-10 lg:mx-14'>
      {metadata ? (
        <>
          <div className="grid text-right justify-end items-center mx-2 text-white">
            <div className="flex items-center gap-2 lg:text-xl">
              <div className='text-lg'>Node Name: </div>
              <div className="text-cb-green">
                {truncateAddress(metadata.owner)}:{metadata.id}
              </div>
            </div>
            <div className="flex justify-end items-center gap-2 text-md">
              <div className="text-opacity-50 text-white">IP Address: </div>
              <div>{metadata.api.domain}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 text-white w-full">
            {perspective === 'provider' ? 
            <div className='col-span-1'>
              <NodeInformation />
            </div> : <></>}
            <div className='col-span-1 md:col-span-2 lg:col-span-1'>
              <ServerSpecs spec={specs} metric={metrics} />
            </div>
            <div
              className={`col-span-1 md:col-span-2 ${perspective !== 'provider' ? '' : ''}`}
            >
              <Terminal link={metadata.api.domain} taskId={metadata.lastTask} />
            </div>
            {metrics && (
              <>
                <div className='col-span-1'>
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
                <div className='col-span-1'>
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
                <div className='col-span-1'>
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
            <div className='col-span-1 md:col-span-2 lg:col-span-3'>
            <RenderChart
              metric={selectedGauge.name}
              data={selectedGauge.data}
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

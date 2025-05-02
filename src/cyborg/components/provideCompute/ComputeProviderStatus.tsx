//TODO: Component not in use right now. Might be necessary in the future in case the abstract one (in /general) doesn't make sense anymore
//Might make more sense to copy and rewrite the absract one in that case

/*
import React, { useEffect, useState } from 'react'
import widget from '../../../../public/assets/icons/widget.png'
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge'
import { useCyborgState } from '../../CyborgContext'
import Chart, { Data } from '../general/Chart'
import axios from 'axios'
import { data1, data2, data3 } from '../../data/MockData'
import deployment from '../../../../public/assets/icons/deployment-type.png'
import id from '../../../../public/assets/icons/id.png'
import earnings from '../../../../public/assets/icons/earnings.png'
import arrowDown from '../../../../public/assets/icons/arrow-circled-down.png'
import arrowUp from '../../../../public/assets/icons/arrow-circled-up.png'

interface GetLogsProps {
  link: string,
  taskId: number,
}

interface ServerSpecsProps {
  spec: {
    operatingSystem: { Description: string },
    localeInformation: { city: string, country: string },
    cpuInformation: { ModelName: string }
  },
  metric: {
    cpu: number, 
    ram: number, 
    storage: number
    memoryUsage: { total: number },
    diskUsage: any
  }
}

interface TerminalProps {
  link: string,
  taskId: number,
}
 
interface GaugeDisplayProps {
  percentage: number,
  fill: string,
  name: string,
  styleAdditions: string,
  selectedGauge: { name: string },
  setAsSelectedGauge: ( name: string, fill: string ) => void,
}

interface RenderChartProps {
  metric: string,
  data: Data,
  color: string,
}

interface ComputeProviderProps {
  perspective: "provider" | "accessor";
}

export const GetLogs: React.FC<GetLogsProps> = ({ link, taskId }: GetLogsProps) => {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState(null)

  // useEffect(()=>{
  //   const stored = sessionStorage.getItem(taskId)
  //   console.log("stored: ", stored)
  //   if (stored) setData(stored)
  // }, [])

  useEffect(() => {
    const fetchData = async (retryCount = 5, interval = 6000) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_HTTP_PREFIX}://${link}/logs/${taskId}`,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
          }
        )
        console.log('logs response: ', response)
        sessionStorage.setItem(`TASKID:${taskId}`, response.data)
        setData(response.data)
      } catch (error) {
        if (retryCount === 0) {
          setData(error)
          console.error('API call failed after 3 retries:', error)
        } else {
          setData(
            'Pending..' + ['.', '.', '.', '.', '.'].slice(retryCount).join('')
          )
          console.warn(`Retrying... ${retryCount} attempts left.`)
          setTimeout(() => fetchData(retryCount - 1, interval), interval)
        }
      }
    }
    console.log(
      'deploy data: ',
      data,
      `${process.env.REACT_APP_HTTP_PREFIX}://${link}/logs/${taskId}`
    )
    const stored = sessionStorage.getItem(`TASKID:${taskId}`)
    console.log('stored: ', taskId, stored)
    if (stored && stored.length > 0) {
      setData(stored)
    } else if (link && data === null) fetchData()
  }, [taskId, link])

  useEffect(() => {
    const fetchStatusInfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_HTTP_PREFIX}://${link}/deployment-status/${taskId}`,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
          }
        )
        setStatus(response.data)
      } catch (error) {
        console.log('STATUS ERROR:: ', error)
        setStatus('error')
      }
    }

    if (link) fetchStatusInfo()
  }, [taskId, link])

  // console.log("deploy status: ", status)
  console.log('logs data: ', data)
  // console.log("display data: ", display)
  return (
    <code className="flex justify-between h-full text-opacity-75 text-white bg-cb-gray-700 bg-opacity-25 w-full rounded-md p-2">
      <div className="flex flex-col">
        {status && status.conditions && status.conditions.length > 0 ? (
          <div
            className={`${
              status && status.conditions.length > 0 ? '' : 'hidden'
            }`}
          >
            <div>
              {`[${link}][TaskID: ${taskId}] Status: ` +
                status.conditions[0].lastUpdateTime}
            </div>
            <div>
              {`[${link}][TaskID: ${taskId}] Status: ` +
                status.conditions[0].message}
            </div>
            <div>
              {`[${link}][TaskID: ${taskId}] Status: ` +
                status.conditions[0].reason}
            </div>
            <div>
              {`[${link}][TaskID: ${taskId}] Status: ` +
                status.conditions[0].status}
            </div>
            <div>
              {`[${link}][TaskID: ${taskId}] Status: ` +
                status.conditions[0].type}
            </div>
          </div>
        ) : (
          ''
        )}
        <div>{`[${link}][TaskID: ${taskId}] Logs: ${
          data ? data : 'Pending.....'
        }`}</div>
      </div>
    </code>
  )
}

const NodeInformation: React.FC = () => {
  const itemData = [
    { name: 'Total Earnings', value: '$3000', icon: earnings },
    { name: 'Provider ID', value: '#CN12001', icon: id },
    { name: 'Deployment Type', value: 'K3S Worker', icon: deployment },
  ]

  const InformationItem = ({ name, value, icon }) => {
    return (
      <div className="bg-cb-gray-600 rounded-lg flex justify-between p-6">
        <div className="flex flex-col gap-4">
          <div className="text-2xl">{name}</div>
          <div className="text-3xl">{value}</div>
        </div>
        <img className="h-full aspect-square" src={icon} />
      </div>
    )
  }

  return (
    <div className="col-span-1 lg:col-span-2 xl:col-span-1 flex flex-col justify-evenly gap-10">
      {itemData.map(({ name, value, icon }, index) => (
        <InformationItem key={index} name={name} value={value} icon={icon} />
      ))}
    </div>
  )
}

const ServerSpecs: React.FC<ServerSpecsProps> = ({ spec, metric }: ServerSpecsProps) => {
  return (
    <div className="bg-cb-gray-600 rounded-lg col-span-1 lg:col-span-2 xl:col-span-1">
      <div className="bg-gradient-to-b from-cb-gray-400 p-6 rounded-lg">
        <h4 className="font-thin">Server Specifications</h4>
      </div>

      <ul className="px-6 py-3 h-auto">
        <li className="flex justify-between">
          <p>OS:</p>
          <p>{spec ? spec.operatingSystem.Description : null}</p>
        </li>
        <li className="flex justify-between">
          <p>CPU:</p>
          <p>{spec ? spec.cpuInformation.ModelName : null}</p>
        </li>
        <li className="flex justify-between">
          <p>Memory:</p>
          <p>
            {metric && metric.memoryUsage ? metric.memoryUsage.total : null}
          </p>
        </li>
        <li className="flex justify-between">
          <p>Storage:</p>
          <p>
            {metric && metric.diskUsage ? metric.diskUsage[0]['size'] : null}
          </p>
        </li>
        <li className="flex justify-between">
          <p>Location:</p>
          <p>
            {spec
              ? `${spec.localeInformation.city}, ${spec.localeInformation.country}`
              : null}
          </p>
        </li>
      </ul>
    </div>
  )
}

const Terminal: React.FC<TerminalProps> = ({ link, taskId }: TerminalProps) => {
  console.log('terminal task: ', taskId)
  return (
    <div className="bg-white bg-opacity-15 relative rounded-lg flex flex-col">
      <div className="absolute top-5 left-5">
        <a>
          <img src={widget} />
        </a>
      </div>
      <div className="bg-gradient-to-b from-cb-gray-400 to-cb-gray-600 p-6 rounded-t-lg">
        <h4 className="flex justify-center font-thin">Terminal</h4>
      </div>
      <ul className="h-full">
        <GetLogs link={link} taskId={taskId} />
      </ul>
    </div>
  )
}

const GaugeDisplay: React.FC<GaugeDisplayProps> = ({
  percentage,
  fill,
  name,
  styleAdditions,
  selectedGauge,
  setAsSelectedGauge,
}: GaugeDisplayProps) => {
  const onMouseDownHandler = () => {
    setAsSelectedGauge(name, fill)
  }

  console.log(percentage, fill, name)
  return (
    //Using mousedown events instead of onclick events on "unimportant" clicks, as feedback is immediate => better UX
    <div
      onMouseDown={() => onMouseDownHandler()}
      className={`${
        name === selectedGauge.name
          ? 'bg-cb-gray-400 border border-cb-green'
          : ''
      } bg-cb-gray-600 rounded-lg relative`}
    >
      <div className="flex items-center p-2 gap-4 absolute top-4 left-4">
        {' '}
        <div
          className={`w-3 h-3 ring-4 ring-opacity-15 rounded-full ${styleAdditions}`}
        ></div>
        <div>
          <h5>{name + ' Usage'}</h5>
        </div>
      </div>
      <div className="h-80 p-2 text-white">
        <Gauge
          value={percentage}
          startAngle={-110}
          endAngle={110}
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 40,
              transform: 'translate(0px, 0px)',
              fill: 'white',
            },
            [`& .${gaugeClasses.valueArc}`]: {
              fill: `${fill}`,
            },
          }}
          text={({ value }) => `${value} %`}
        />
      </div>
      <div
        className={`${
          name === selectedGauge.name ? 'bg-cb-green' : 'bg-cb-gray-400'
        } w-full flex gap-2 text-lg justify-center items-center h-12 rounded-b-lg`}
      >
        <div>View Details</div>
        <img src={name === selectedGauge.name ? arrowUp : arrowDown} />
      </div>
    </div>
  )
}

const RenderChart: React.FC<RenderChartProps> = ({ metric, data, color }: RenderChartProps) => {
  return (
    <div className="bg-cb-gray-600 rounded-lg p-10 col-span-1 lg:col-span-2 xl:col-span-3">
      <div className="flex justify-between">
        <div className="text-2xl font-bold">{metric} Usage</div>
        <div>1 Hour</div>
      </div>
      <div className="p-6 overflow-visible">
        <Chart data={data} color={color} />
      </div>
    </div>
  )
}

const ComputeProviderStatus: React.FC<ComputeProviderProps> = ({ perspective }: ComputeProviderProps) => {
  const { metadata } = useCyborgState().dashboard
  // const { taskMetadata } = useCyborgState()
  // const [taskId, setTaskId] = useState(taskMetadata && taskMetadata.taskId? taskMetadata.taskId : "");
  // const [link, setLink] = useState(metadata && metadata.api? metadata.api.domain : "");
  const taskId = metadata.lastTask
  const link = metadata.api.domain

  const [specs, setSpecs] = useState()
  const [metrics, setMetrics] = useState()
  const [selectedGauge, setSelectedGauge] = useState({
    name: 'CPU',
    color: 'var(--gauge-red)',
    data: data1,
  }) //"CPU || "RAM" || "DISK"

  const handleSetSelectedGauge = (name: string, color: string) => {
    let data: any
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
    const fetchSpecs = async () => {
      try {
        const specRes = await axios.get(
          `${process.env.REACT_APP_HTTP_PREFIX}://${link}/system-specs`
        )
        setSpecs(specRes.data)
      } catch (error) {
        console.error('SPECS ERROR:: ', error)
      }
    }
    if (link) fetchSpecs()
  }, [link])

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metricRes = await axios.get(
          `${process.env.REACT_APP_HTTP_PREFIX}://${link}/consumption-metrics`
        )
        setMetrics(metricRes.data)
      } catch (error) {
        console.error('METRICS ERROR:: ', error)
      }
    }
    if (link) fetchMetrics()
  }, [link])

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
  console.log('task state: ', taskId)
  // TODO: Retrieve Server Usage Specs to replace gauge values
  return (
    <div className="h-screen bg-cb-gray-700 flex flex-col overflow-scroll">
      <div className="flex items-center justify-between mx-2 text-white p-4 px-14">
        <div className="flex items-end gap-2 text-xl">
          <div>Node Name: </div>
          <div className="text-cb-green">
            {metadata.owner}:{metadata.id}
          </div>
        </div>
        <div className="flex items-end gap-2 text-md">
          <div className="text-opacity-50 text-white">IP Address: </div>
          <div>{link}</div>
        </div>
      </div>
      <div className="grid grid-col-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 p-2 px-16 text-white">
        {perspective === 'provider' ? <NodeInformation /> : <></>}
        <ServerSpecs spec={specs} metric={metrics} />
        <div className={`${perspective !== 'provider' ? 'col-span-2' : ''}`}>
          <Terminal link={link} taskId={taskId} />
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
    </div>
  )
}

export default ComputeProviderStatus;
*/
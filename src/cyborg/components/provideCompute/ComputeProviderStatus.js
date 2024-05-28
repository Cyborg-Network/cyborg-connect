import React, {useEffect, useState} from 'react'
import widget from '../../../../public/assets/icons/widget.png' 
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { useCyborgState } from '../../CyborgContext';
import axios from 'axios';

export function GetLogs({link, taskId, loading }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(null);
  const [display, setDisplay] = useState(`[${link}][TaskID: ${taskId}] Logs: Pending.....`);

  useEffect(()=>{
    if (data && !loading)setDisplay(`[${link}][TaskID: ${taskId}] Logs: ${ data }`)
  }, [data])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http${link.includes('127.0.0.1')?'':'s'}://${link}/logs/${taskId}`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          }});
        setData(response.data);
      } catch (error) {
        console.log("DATA ERROR:: ", error);
        
        setData("error")
      } 
    };

    if (link) fetchData();
  }, [taskId, link]);

  useEffect(() => {
    const fetchStatusInfo = async () => {
      try {
        const response = await axios.get(`http${link.includes('127.0.0.1')?'':'s'}://${link}/deployment-status/${taskId}`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          }});
          setStatus(response.data);
      } catch (error) {
        console.log("STATUS ERROR:: ", error);
        
        setStatus("error")
      } 
    };
    console.log("deploy status: ", status)
    if (link) fetchStatusInfo();
  }, [taskId, link]);

  return (
      <code className='flex justify-between h-full text-opacity-75 text-white bg-cb-gray-700 bg-opacity-25 w-full rounded-md p-2'>
        <div className='flex flex-col'>
          {!loading && status && status.conditions && status.conditions.length > 0? <div className={`${status && status.conditions.length > 0? '': 'hidden'}`}>
              <div>{`[${link}][TaskID: ${taskId}] Status: ` + status.conditions[0].lastUpdateTime}</div>
              <div>{`[${link}][TaskID: ${taskId}] Status: ` + status.conditions[0].message}</div>
              <div>{`[${link}][TaskID: ${taskId}] Status: ` + status.conditions[0].reason}</div>
              <div>{`[${link}][TaskID: ${taskId}] Status: ` + status.conditions[0].status}</div>
              <div>{`[${link}][TaskID: ${taskId}] Status: ` + status.conditions[0].type}</div>
          </div>: ''}
          <div>{display}</div>
          </div>
        </code>
  )
}

function ServerSpecs() {
  return (
    <div className='bg-cb-gray-600 rounded-lg col-span-1 lg:col-span-2 xl:col-span-1'>
        <div className='bg-gradient-to-b from-cb-gray-400 p-6 rounded-lg'>
          <h4 className='font-thin'>Server Specifications</h4>
        </div>
        
        <ul className='px-6 py-3 h-auto'>
            <li className='flex justify-between'><p>OS:</p><p>Windows</p></li>
            <li className='flex justify-between'><p>CPU:</p><p>{}</p></li>
            <li className='flex justify-between'><p>Memory:</p><p>{}</p></li>
            <li className='flex justify-between'><p>Network:</p><p>{}</p></li>
            <li className='flex justify-between'><p>Storage:</p><p>{}</p></li>
            <li className='flex justify-between'><p>Location:</p><p>{}</p></li>
        </ul>
    </div>
  )
}

function Terminal({link, taskId}) {
  console.log("terminal task: ", taskId)
    return (
      <div className='lg:col-span-2 bg-white bg-opacity-15 relative rounded-lg h-auto'>
        <div className='absolute top-5 left-5'>
          <a>
            <img src={widget} />
          </a>
        </div>
        <div className='bg-gradient-to-b from-cb-gray-400 to-cb-gray-600 p-6 rounded-t-lg'>
          <h4 className='flex justify-center font-thin'>Terminal</h4>
        </div>
        <ul className='h-full'>
            {/* <li className='flex justify-between'><p>Last Login:</p><p>Fri June 04, 01:34:00</p></li> */}
            <GetLogs link={link} taskId={taskId}/>
      
        </ul>
      </div>
    )
  }

  function GaugeDisplay({percentage, fill, name, styleAdditions }) {
    return (
      <div className='bg-cb-gray-600 rounded-lg p-4'>
        <div className='flex items-center p-2 gap-2'>
          <div className={`w-3 h-3 ring-4 ring-opacity-15 rounded-full ${styleAdditions}`}></div>
          <div><h5>{name + " Usage"}</h5></div>
        </div>
        <div className='h-80 p-2 text-white'>
          <Gauge
            value={percentage}
            startAngle={-110}
            endAngle={110}
            sx={{
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 40,
                transform: 'translate(0px, 0px)',
                fill: 'white'
              },
              [`& .${gaugeClasses.valueArc}`]: {
                fill: `${fill}`,
              },
            }}
            text={
              ({ value }) => `${value} %`
            }
          />
        </div> 
      </div>
    )
  }

export default function ComputeProviderStatus() {
  const { metadata } = useCyborgState().dashboard
  const { taskMetadata } = useCyborgState()
  const [taskId, setTaskId] = useState(taskMetadata.taskId? taskMetadata.taskId : null);
  const [link, setLink] = useState(`${metadata.ip.ipv4.join('.')}:${metadata.port.replace(",", "")}`);
  // let taskId = taskMetadata? taskMetadata.taskId : null;
  useEffect(()=>{
    const route = `${metadata.ip.ipv4.join('.')}:${metadata.port.replace(",", "")}`
    if (taskMetadata) {
      setTaskId(taskMetadata.taskId)
      setLink(route)
    }
  },[taskMetadata])
  console.log("metadata: ", metadata)
  // console.log("task state: ", taskId)
  // TODO: Retrieve Server Usage Specs to replace gauge values
  return (
    <div className='h-screen bg-cb-gray-700 flex flex-col overflow-scroll'>
        <div className='flex items-center justify-between mx-2 text-white p-4 px-14'>
            <div className='flex items-end gap-2 text-xl'>
              <div>Node Name: </div>
              <div className='text-cb-green'>{metadata.name}</div>
            </div> 
            <div className='flex items-end gap-2 text-md'>
              <div className='text-opacity-50 text-white'>IP Address: </div>
              <div>{link}</div>
            </div> 
        </div> 
        <div className='grid grid-col-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 p-2 px-16 text-white'>
            <ServerSpecs />
            <Terminal link={link} taskId={taskId} />
            <GaugeDisplay percentage={metadata.account?80:5} fill={'#FF5858'} name={'CPU'} styleAdditions={"ring-gauge-red bg-gauge-red"}/>
            <GaugeDisplay percentage={metadata.account?30:5} fill={'#28E92F'} name={'RAM'} styleAdditions={"ring-gauge-green bg-gauge-green"}/>
            <GaugeDisplay percentage={metadata.account?40:5} fill={'#F8A832'} name={'DISK'} styleAdditions={"ring-gauge-yellow bg-gauge-yellow"}/>
        </div>
        <div className='flex items-center'>

        </div>
    </div>
  )
}

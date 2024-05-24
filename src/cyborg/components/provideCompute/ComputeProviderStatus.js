import React from 'react'
import widget from '../../../../public/assets/icons/widget.png' 
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

function ServerSpecs() {
  return (
    <div className='bg-cb-gray-600 rounded-lg col-span-1 lg:col-span-2 xl:col-span-1'>
        <div className='bg-gradient-to-b from-cb-gray-400 p-6 rounded-lg'>
          <h4 className='font-thin'>Server Specifications</h4>
        </div>
        
        <ul className='px-6 py-3 h-auto'>
            <li className='flex justify-between'><p>OS:</p><p>Windows</p></li>
            <li className='flex justify-between'><p>CPU:</p><p>Windows</p></li>
            <li className='flex justify-between'><p>Memory:</p><p>Windows</p></li>
            <li className='flex justify-between'><p>Network:</p><p>Windows</p></li>
            <li className='flex justify-between'><p>Storage:</p><p>Windows</p></li>
            <li className='flex justify-between'><p>Location:</p><p>Windows</p></li>
        </ul>
    </div>
  )
}

function Terminal() {
    return (
      <div className='lg:col-span-2 bg-white bg-opacity-10 relative rounded-lg h-auto'>
        <div className='absolute top-5 left-5'>
          <a>
            <img src={widget} />
          </a>
        </div>
        <div className='bg-gradient-to-b from-cb-gray-400 to-cb-gray-600 p-6 rounded-t-lg'>
          <h4 className='flex justify-center font-thin'>Terminal</h4>
        </div>
          <ul className='px-6 py-3 h-fit'>
              <li className='flex justify-between'><p>Last Login:</p><p>Fri June 04, 01:34:00</p></li>
             
       
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
  return (
    <div className='h-screen bg-cb-gray-700 flex flex-col overflow-scroll'>
        <div className='flex items-center justify-between mx-2 text-white'>
            <h3>Node Name</h3> <div><p>IP Address:</p></div>
        </div> 
        <div className='grid grid-col-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 p-16 text-white'>
            <ServerSpecs />
            <Terminal />
            {/* <ServerSpecs /> */}
            <GaugeDisplay percentage={80} fill={'#FF5858'} name={'CPU'} styleAdditions={"ring-gauge-red bg-gauge-red"}/>
            <GaugeDisplay percentage={30} fill={'#28E92F'} name={'RAM'} styleAdditions={"ring-gauge-green bg-gauge-green"}/>
            <GaugeDisplay percentage={40} fill={'#F8A832'} name={'DISK'} styleAdditions={"ring-gauge-yellow bg-gauge-yellow"}/>
            {/* <ServerSpecs />
            <ServerSpecs />
            <ServerSpecs /> */}
        </div>
        <div className='flex items-center'>

        </div>
    </div>
  )
}

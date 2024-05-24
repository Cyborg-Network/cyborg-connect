import React from 'react'
import widget from '../../../../public/assets/icons/widget.png' 


function ServerSpecs() {
  return (
    <div className='bg-cb-gray-600 rounded-lg'>
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
      <div className='col-span-2 bg-white bg-opacity-10 relative rounded-lg h-auto'>
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

  function GaugeDisplay() {
    return (
      <div>
      </div>
    )
  }

export default function ComputeProviderStatus() {
  return (
    <div className='h-screen bg-cb-gray-700 flex flex-col '>
        <div className='flex items-center justify-between mx-2 text-white'>
            <h3>Node Name</h3> <div><p>IP Address:</p></div>
        </div> 
        <div className='grid grid-cols-3 gap-10 p-16 text-white'>
            <ServerSpecs />
            <Terminal />
            <GaugeDisplay />
        </div>
        <div className='flex items-center'>

        </div>
    </div>
  )
}

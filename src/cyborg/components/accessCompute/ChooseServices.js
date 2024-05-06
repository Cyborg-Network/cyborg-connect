import React, { useState } from 'react'
import cyberdock from '../../../../public/assets/icons/cyberdock.png' 
import comingsoon from '../../../../public/assets/icons/comingsoon.png' 
import UploadDockerImgURL from './modals/UploadDockerImgURL.js'

export const SERVICES = {
    CYBER_DOCK: "CYBER_DOCK"
}
function ServiceCards({logo, title, description = '', setService, service = null}) {
    return (
        <div className='border hover:ring-2 hover:ring-cb-gray-400 border-cb-gray-400 rounded-md w-80'>
            <div className='flex flex-col items-center focus:text-cb-green bg-cb-gray-600 h-full justify-between'>
                <a className='pt-10'>
                    <img src={logo} />
                </a>
                
                <h3 className='text-white'>{title}</h3>
                <p className='text-white opacity-50 text-center text-sm'>{description}</p>
                <div className='flex justify-center text-white opacity-50 bg-cb-gray-400 w-full h-14'>
                    <button onClick={()=>setService(service)} className='hover:text-cb-green'>
                        <h4>Deploy Now</h4>
                    </button>
                </div>
            </div>
            
        </div>
    )
}
function ChooseServices() {
    const [service, setService]=useState(null);
  return (
    <div className='relative h-screen bg-cb-gray-700 flex flex-col items-center justify-center'>
        <h1 className='text-white'>Choose Services</h1>
        <div className='flex sm:flex-row flex-col gap-4 p-2'>
            <ServiceCards logo={cyberdock} title='Cyber Dock' description='(deploy docker images at ease)' setService={setService} service={SERVICES.CYBER_DOCK}/>
            <ServiceCards logo={comingsoon} title='Coming Soon...'/>
            <ServiceCards logo={comingsoon} title='Coming Soon...'/>
        </div>
        <div className='flex sm:flex-row flex-col gap-4 p-3'>
            <ServiceCards logo={comingsoon} title='Coming Soon...'/>
            <ServiceCards logo={comingsoon} title='Coming Soon...'/>
        </div>
        {
            service === SERVICES.CYBER_DOCK? (
                <div className='h-full w-full absolute z-10'>
                    <UploadDockerImgURL setService={setService}/>
                </div>
            ) : (<></>)
        }
        
    </div>
  )
}

export default ChooseServices
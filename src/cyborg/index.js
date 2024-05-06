import React from 'react'
import Header from './layouts/Header'
import Dashboard from './components/provideCompute/Dashboard'
import SideBar from './layouts/SideBar'
import ChooseServices from './components/accessCompute/ChooseServices'
import ChoosePath from './ChoosePath'
import { SERVICES, useCyborgState } from './CyborgContext'
import LoadDeployCyberDock from './components/accessCompute/modals/LoadDeployCyberDock'

function CyborgDapp() {
   const { selectedPath, service } = useCyborgState()
  return (
    <div className='max-h-screen flex flex-col '>
        { !selectedPath? (
            <><Header /><ChoosePath /></>
        ): (
            (selectedPath === 'PROVIDER' || service === SERVICES.CYBER_DOCK)? (
                <div className='flex relative'>
                    <div className='fixed top-0 left-0 w-80'>
                        <SideBar />
                    </div>
                    <div className='w-full ml-80'>
                        <Dashboard />
                    </div>
                    {
                        service === SERVICES.CYBER_DOCK? (
                            <div className='h-full w-full absolute z-10'>
                                <LoadDeployCyberDock />
                            </div>
                        ) : (<></>)
                    }
                </div>
            ) : (
                <><Header /><ChooseServices /></>
            )
        )}
    </div>
  )
}

export default CyborgDapp
import React from 'react'
import Header from './layouts/Header'
import Dashboard from './components/provideCompute/Dashboard'
import SideBar from './layouts/SideBar'
import ChooseServices from './components/accessCompute/ChooseServices'
import ChoosePath from './ChoosePath'
import { useCyborgState } from './CyborgContext'

function CyborgDapp() {
   const { selectedPath } = useCyborgState()
  return (
    <div className='max-h-screen flex flex-col '>
        { !selectedPath? (
            <><Header /><ChoosePath /></>
        ): (
            (selectedPath === 'PROVIDER')? (
                <div className='flex'>
                    <div className='fixed top-0 left-0 w-80'>
                        <SideBar />
                    </div>
                    <div className='w-full ml-80'>
                        <Dashboard />
                    </div>
                </div>
            ) : (
                <><Header /><ChooseServices /></>
            )
        )}
    </div>
  )
}

export default CyborgDapp
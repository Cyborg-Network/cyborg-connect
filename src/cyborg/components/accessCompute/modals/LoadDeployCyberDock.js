import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'
import dockdeploy from '../../../../../public/assets/icons/dockdeploy.png'
function LoadDeployCyberDock() {
  return (
      <Dimmer active >
        <div className='flex flex-col items-center justify-center gap-6 max-w-1/3 bg-cb-gray-600 py-16 px-28 rounded-lg'>
          <a className='relative flex'> 
              <Loader size='massive'/>
            <img height={75} width={75} src={dockdeploy} />
          </a>
          <p>Deploying you container securely!</p>
        </div>
      </Dimmer>
  )
}

export default LoadDeployCyberDock
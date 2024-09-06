import React, { useState } from 'react'
import nondeployed from '../../../../../public/assets/icons/nondeployed.png'
import deploymentsTab from '../../../../../public/assets/icons/deployment-logo.png'
import { FiPlusCircle } from 'react-icons/fi'
import { useCyborg, useCyborgState } from '../../../CyborgContext'
import { Button } from 'semantic-ui-react'
import { TbRefresh } from 'react-icons/tb'
import { NodeList } from './NodeList'
import { useUi } from '../../../context/UiContext'

function AddNodeButton({ addNode }) {
  return (
    <button
      onClick={() => addNode(true)}
      className="flex items-center gap-1 size-30 text-white py-3 px-6 rounded-md bg-cb-green focus:bg-cb-gray-400"
    >
      <FiPlusCircle size={18} /> Add Node
    </button>
  )
}

function NoNodes({ addNode }) {
  return (
    <div className="flex flex-col justify-center h-2/3 items-center">
      <a className="">
        <img src={nondeployed} />
      </a>
      <div className="text-white flex flex-col">
        <p>Currently, you don't have any nodes.</p>
        <button onClick={() => addNode(true)} className="hover:text-cb-green">
          <u>Add your first node</u>
        </button>
      </div>
    </div>
  )
}

function Dashboard({ perspective }) {
  const [node, addNode] = useState(false)

  const { taskMetadata } = useCyborgState()
  const { workersWithLastTasks, setReloadWorkers } = useCyborg()
  const { sidebarIsActive } = useUi();

  console.log('workerList: ', workersWithLastTasks)

  return (
    <div className={`w-screen h-screen ${sidebarIsActive ? 'lg:pl-80' : 'lg:pl-0'} transition-all duration-500 ease-in-out`}>
    <div className='w-full h-full justify-self-start flex flex-col'>
      <div className="flex items-center justify-between mx-2 text-white">
        <div className={`flex items-center ${sidebarIsActive ? 'ml-0' : 'ml-burger-btn-offset'} transition-all duration-500 ease-in-out`}>
          <img src={deploymentsTab} />
          <div>
            <h3 className="mb-0">Deployments</h3>
            <p className="text-white text-opacity-70">Dashboard / Node List</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setReloadWorkers(true)}>
            <TbRefresh />
          </Button>
          {perspective === 'provide-compute' ? (
            <AddNodeButton addNode={addNode} />
          ) : (
            <></>
          )}
        </div>
      </div>
      {node ||
      (workersWithLastTasks &&
        workersWithLastTasks.length > 0 &&
        taskMetadata) ? (
        <NodeList nodes={workersWithLastTasks} taskMetadata={taskMetadata} />
      ) : (
        <NoNodes addNode={addNode} />
      )}
    </div>
    </div>
  )
}

export default Dashboard

import React, { useState } from 'react'
import nondeployed from '../../../../../public/assets/icons/nondeployed.png'
import deploymentsTab from '../../../../../public/assets/icons/deployment-logo.png'
import cyberdock from '../../../../../public/assets/icons/cyberdockDash.png'
import { FiPlusCircle } from 'react-icons/fi'
import { useCyborg, useCyborgState } from '../../../CyborgContext'
import { Button } from 'semantic-ui-react'
import { TbRefresh } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../../index'

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

function NodeList({ nodes, taskMetadata }) {
  const navigate = useNavigate()

  const lastTask = taskMetadata.taskId

  console.log('nodes: in list: ', nodes)
  console.log('lastTask: ', lastTask)

  return (
    <div className="flex flex-col w-full text-white text-opacity-70 ">
      <span
        className={`${nodes.length < 1 ? 'hidden' : ''} flex w-full py-2 px-5`}
      >
        <ul className="grid grid-cols-4 w-full">
          <li>Name / Address</li>
          <li>Type</li>
          <li>URL / IP</li>
          <li>Status</li>
        </ul>
      </span>
      <div className="bg-white bg-opacity-10 m-4 rounded-lg">
        {nodes.length > 0 &&
          nodes.map(item => (
            <div
              key={item.owner + item.id}
              onClick={() =>
                navigate(`${ROUTES.COMPUTE_STATUS}/${item.api.domain}`, {
                  state: item,
                })
              }
              className={`hover:text-cb-green hover:font-bold hover:cursor-pointer ${
                lastTask === item.lastTask
                  ? 'p-1 border border-transparent bg-gradient-to-r from-cb-green via-yellow-500 to-cb-green bg-clip-border animated-border'
                  : ''
              }`}
            >
              <span className="flex justify-between w-full items-center py-4 px-5 bg-cb-gray-400">
                <ul className="grid grid-cols-4 w-full items-center">
                  <li className="flex items-center gap-3]">
                    <a>
                      <img src={cyberdock} />
                    </a>
                    <button className="pl-3 flex flex-col items-start">
                      <p className="mt-0 text-sm">
                        ID:{item.owner.slice(0, 16)}:{item.id}
                      </p>
                    </button>
                  </li>
                  <li>Providers</li>
                  <li>{`${item.api.domain}`}</li>
                  <li
                    className={`flex gap-2 ${
                      item.status ? 'text-cb-green' : 'text-red-600'
                    }`}
                  >
                    {item.lastTask ? `taskId: ${item.lastTask}` : 'idle'}
                    <p
                      className={`font-bold ${
                        lastTask === item.lastTask
                          ? 'right-2 top-2 text-white'
                          : 'hidden'
                      }`}
                    >
                      Task Executed
                    </p>
                  </li>
                </ul>
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}

function Dashboard({ perspective }) {
  const [node, addNode] = useState(false)

  const { taskMetadata } = useCyborgState()
  const { workersWithLastTasks, setReloadWorkers } = useCyborg()

  console.log('workerList: ', workersWithLastTasks)

  return (
    <div className="h-screen bg-cb-gray-700 flex flex-col ">
      <div className="flex items-center justify-between mx-2 text-white">
        <div className="flex items-center">
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
  )
}

export default Dashboard

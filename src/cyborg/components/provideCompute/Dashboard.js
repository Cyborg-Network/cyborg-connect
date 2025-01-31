import React, { useState } from 'react'
import nondeployed from '../../../../public/assets/icons/nondeployed.png'
import deploymentsTab from '../../../../public/assets/icons/deployment-logo.png'
import cyberdock from '../../../../public/assets/icons/cyberdockDash.png'
import { FiPlusCircle } from 'react-icons/fi'
import { useCyborg, useCyborgState } from '../../CyborgContext'
import { Button } from 'semantic-ui-react'
import { TbRefresh } from 'react-icons/tb'
import { useSubstrateState } from '../../../substrate-lib'
import { getAccount } from '../../util/getAccount'

//TODO: Component not in use right now. Might be necessary in the future in case the abstract one (in /general) doesn't make sense anymore

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

//alignment should be either 'items-center' or undefined, this will be better with ts
function Modal({ children, alignment }) {
  return (
    <div className="fixed bg-cb-gray-400 backdrop-blur-lg bg-opacity-30 h-full w-full left-0 top-0 z-50 grid justify-center items-center">
      <div
        className={`${alignment} fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-6 text-white bg-cb-gray-700 2xl:w-1/5 xl:w-2/5 lg:w-3/5 sm:w-1/2 w-5/6 rounded-lg p-16`}
      >
        {children}
      </div>
    </div>
  )
}

function AddNodeModal({ addNode }) {
  const [deployCommand, setDeployCommand] = useState('')

  return (
    <Modal alignment={undefined}>
      <div className="flex justify-between items-top">
        <h3>Deploy Master Node</h3>
        <button
          onClick={() => addNode(false)}
          className="bg-cb-gray-400 rounded-full h-fit p-1.5 aspect-square hover:text-cb-green"
        >
          <IoClose size={20} />
        </button>
      </div>
      <div className="h-1 border-t border-cb-gray-500 w-full" />
      <div className="relative h-fit">
        <input
          type="text"
          placeholder="Insert command to deploy node..."
          onChange={e => {
            setDeployCommand(e.target.value)
          }}
          className="w-full p-3.5 bg-cb-gray-500 border border-cb-gray-600 text-white rounded-lg focus:border-cb-green focus:ring-cb-green focus:outline-none"
          required
        />
        <CopyToClipboard text={deployCommand}>
          <button className="absolute rounded-lg bg-cb-gray-400 focus:text-cb-green right-2 top-1/2 -translate-y-1/2">
            <IoMdCopy size={25} />
          </button>
        </CopyToClipboard>
      </div>
      <div className="h-1 border-t border-cb-gray-500 w-full" />
      <button
        onClick={() => {
          alert('Not yet implemented')
        }}
        className="flex w-1/2 items-center text-cb-gray-500 self-center justify-center gap-1 size-30 py-3 px-6 rounded-md bg-cb-green focus:bg-cb-gray-500 focus:text-cb-green"
      >
        Deploy
      </button>
    </Modal>
  )
}

function WaitingForNodeModal() {
  return (
    <Modal alignment={'items-center'}>
      <img className="w-32 aspect-square" src={dockdeploy} alt="deploying..." />
      <h3>Waiting for your node's response...</h3>
    </Modal>
  )
}

function SuccessfulDeployModal() {
  return (
    <Modal alignment={'items-center'}>
      <div className="grid justify-center items-center rounded-full w-32 aspect-square bg-cb-gray-600">
        <div className="grid justify-center items-center rounded-full w-24 aspect-square bg-cb-gray-400 text-cb-green">
          <FaCheck size={50} />
        </div>
      </div>
      <div className="text-cb-green text-4xl">Success!</div>
      <div className="text-3xl">Your master node is connected.</div>
    </Modal>
  )
}

function NodeList({ nodes, taskMetadata }) {
  const { toggleDashboard } = useCyborg()
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
          nodes.map((item, key) => (
            <div
              key={key}
              onClick={() => {
                return
              }}
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

function Dashboard() {
  const [node, addNode] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const { taskMetadata } = useCyborgState()

  useEffect(() => {
    console.log(node)
  }, [node])

  const {
    data: userWorkerClusters,
    refetch: refetchWorkerClusters,
    //isLoading: computeHourPriceIsLoading,
    //error: computeHourPriceError 
  } = useUserWorkersQuery(isProvider, "workerClusters");

  const {
    data: userExecutableWorkers,
    refetch: refetchExecutableWorkers,
    //isLoading: computeHourPriceIsLoading,
    //error: computeHourPriceError 
  } = useUserWorkersQuery(isProvider, "executableWorkers");

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
          <Button onClick={() => setRefresh(!refresh)}>
            <TbRefresh />
          </Button>
          <AddNodeButton addNode={addNode} />
        </div>
      </div>
      {node || (userWorkerClusters && userWorkerClusters.lenth > 0 && userExecutableWorkers && userExecutableWorkers.length > 0 ) ? (
        <NodeList nodes={[...userExecutableWorkers, ...userWorkerClusters]} taskMetadata={taskMetadata} />
      ) : (
        <NoNodes addNode={addNode} />
      )}
    </div>
  )
}

export default Dashboard

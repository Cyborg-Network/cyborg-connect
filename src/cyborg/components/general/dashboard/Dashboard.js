import React, { useEffect, useState } from 'react'
import nondeployed from '../../../../../public/assets/icons/nondeployed.png'
import deploymentsTab from '../../../../../public/assets/icons/deployment-logo.png'
//import { FiPlusCircle } from 'react-icons/fi'
import { useCyborg, useCyborgState } from '../../../CyborgContext'
import Button from '../buttons/Button'
import { TbRefresh } from 'react-icons/tb'
import { NodeList } from './NodeList'
import { useUi } from '../../../context/UiContext'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '../../../../index'
import AddNodeModal from '../../provideCompute/modals/AddNode'
import FirstNodeDeployModal from '../../provideCompute/modals/FirstNodeDeploy'
import { getAccount } from '../../../util/getAccount'
import { useSubstrateState } from '../../../../substrate-lib'
import { toast } from 'react-hot-toast'

function PlaceholderIfNoNodes({ addNode }) {
  return (
    <div className="flex flex-col justify-center h-full items-center">
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

function Dashboard() {
  const location = useLocation();
  const isProvider = location.pathname === ROUTES.PROVIDE_COMPUTE;

  const [addNodeModalIsActive, setAddNodeModalIsActive] = useState(false);
  const [firstDeployModalIsActive, setFirstDeployModalIsActive] = useState(false);
  const [listedWorkers, setListedWorkers] = useState(undefined);

  const { taskMetadata, userTasks } = useCyborgState()
  const { workersWithLastTasks, setReloadWorkers } = useCyborg()
  const { currentAccount } = useSubstrateState()
  const { sidebarIsActive } = useUi()

  useEffect(async () => {
    if(currentAccount)
    setListedWorkers(await handleReturnWorkers())
  }, [workersWithLastTasks, currentAccount, userTasks, taskMetadata])

  useEffect(() => {
    setReloadWorkers(true)
  }, [userTasks, taskMetadata, setReloadWorkers])

  console.log('workerList: ', workersWithLastTasks)

  const handleAddNodeButtonClick = () => {
    if(!localStorage.getItem('cyborgConnectDeployIntroductionShown')){
      setFirstDeployModalIsActive(true);
    } else {
      setAddNodeModalIsActive(true);
    }
  }
  
  const handleDismissFirstNodeModal = () => {
    setFirstDeployModalIsActive(false);
    setAddNodeModalIsActive(true);
  }

  // TODO: The whole way of getting to this point is not optimal, but the root of this issue is in the task-management / edge-connect pallet and we should start fixing it there
  const handleReturnWorkers = async () => {
    console.warn(userTasks);
    console.warn(workersWithLastTasks);
    let userWorkers = [];
    if(isProvider){
      try{
        const userAccount = await getAccount(currentAccount); 
        console.warn(userAccount)
        if(workersWithLastTasks.workerClusters)
        workersWithLastTasks.workerClusters.filter(worker => {
          if(userAccount[0] == worker.owner){
            userWorkers.push({...worker, workerType: "docker"});
          }
        })
        if(workersWithLastTasks.executableWorkers)
        workersWithLastTasks.executableWorkers.filter(worker => {
          console.warn(worker)
          console.warn(userAccount[0])
          if(userAccount[0] == worker.owner){
            console.warn("TRUE");
            userWorkers.push({...worker, workerType: "executable"});
          }
        })
      } catch(error){
        toast("Error Retrieving the Workers...")
      }
    }else{
      if(workersWithLastTasks.workerClusters)
      workersWithLastTasks.workerClusters.filter(worker => {
        if(userTasks)
        if(userTasks.includes(worker.lastTask)){
          userWorkers.push(worker);
        }
      })
      if(workersWithLastTasks.executableWorkers)
      workersWithLastTasks.executableWorkers.filter(worker => {
        if(userTasks)
        if(userTasks.includes(worker.lastTask)){
          userWorkers.push(worker);
        }
      })
    }
    console.warn(userWorkers)
    return userWorkers
  }

  return (
    <div
      className={`w-screen h-screen ${
        sidebarIsActive ? 'lg:pl-80' : 'lg:pl-0'
      } transition-all duration-500 ease-in-out`}
    >
      <div className="w-full h-full justify-self-start flex flex-col">
        <div className="flex items-center justify-between mx-2 text-white">
          <div
            className={`flex items-center ${
              sidebarIsActive ? 'ml-0' : 'ml-burger-btn-offset'
            } transition-all duration-500 ease-in-out`}
          >
            <img src={deploymentsTab} />
            <div>
              <h3 className="mb-0">{isProvider ? 'Your Nodes' : 'Deployments'}</h3>
              <p className="hidden sm:block text-white text-opacity-70">
                Dashboard / Node List
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variation={'secondary'} onClick={() => setReloadWorkers(true)}>
              <TbRefresh />
            </Button>
            {/*{isProvider ? (
              <Button additionalClasses={'flex gap-2 items-center'} variation={'primary'} onClick={handleAddNodeButtonClick} >
                <FiPlusCircle size={18} /> Add Node
              </Button>
            ) : (
              <></>
            )}*/}
          </div>
        </div>
        {((listedWorkers) && userTasks &&
          (workersWithLastTasks.executableWorkers.length > 0 || workersWithLastTasks.workerClusters.length > 0) &&
          taskMetadata) ? (
          <NodeList nodes={listedWorkers} taskMetadata={taskMetadata} isProvider={isProvider} />
        ) : (
          <PlaceholderIfNoNodes addNode={handleAddNodeButtonClick} />
        )}
        {addNodeModalIsActive
          ? <AddNodeModal onCancel={() => setAddNodeModalIsActive(false)}/>
          : <></>
        }
        {firstDeployModalIsActive
          ? <FirstNodeDeployModal onProceed={() => handleDismissFirstNodeModal()} onCancel={() => setFirstDeployModalIsActive(false)}/>
          : <></>
        }
      </div>
    </div>
  )
}

export default Dashboard

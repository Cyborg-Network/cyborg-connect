import React, {
  useReducer,
  useState,
  useContext,
  useEffect,
} from 'react'
import comingsoon from '../../public/assets/icons/comingsoon.svg'
import cyberdock from '../../public/assets/icons/cyberdock.svg'
import neurozk from '../../public/assets/icons/neuro-zk.svg'

export const SERVICES = {
  NO_SERVICE: {
    id: null, 
    name: null, 
    icon: comingsoon, 
    substrateEnumValue: null,
    workerType: null
  },
  CYBER_DOCK: {
    id: "CYBER_DOCK", 
    name: "Cyber Dock", 
    icon: cyberdock, 
    substrateEnumValue: "docker",
    workerType: "workerClusters"
  },
  EXECUTABLE: {
    id: "EXECUTABLE", 
    name: "Executable", 
    icon: neurozk, 
    substrateEnumValue: "executable",
    workerType: "executableWorkers"
  }
}

export const DEPLOY_STATUS = {
  PENDING: 'PENDING',
  READY: 'READY',
  FAILED: 'FAILED',
}

///
// Initial state for `useReducer`

const initialState = {
  // These are the states
  service: null,
  serviceStatus: {
    deployCompute: null,
    deployTask: null,
  },
  workerList: null,
  taskList: null,
  taskMetadata: null,
  userTasks: null,
}

///
// Actions types for 'useReducer`
const ACTIONS = {
  SELECT_SERVICE: 'SELECT_SERVICE',
  DEPLOY_SERVICE: 'DEPLOY_SERVICE',
  LIST_WORKERS: 'LIST_WORKERS',
  LIST_TASKS: 'LIST_TASKS',
  SET_TASK_METADATA: 'SET_TASK_METADATA',
  SET_USER_TASKS: 'SET_USER_TASKS',
}

///
// Reducer function for `useReducer`

const reducer = (state, action) => {
  console.log('cyborg action: ', action)
  console.log('cyborg state: ', state)
  switch (action.type) {
    case ACTIONS.SELECT_SERVICE:
      return { ...state, service: action.payload }
    case ACTIONS.DEPLOY_SERVICE:
      return { ...state, serviceStatus: action.payload }
    case ACTIONS.LIST_WORKERS:
      return { ...state, workerList: action.payload }
    case ACTIONS.LIST_TASKS:
      return { ...state, taskList: action.payload }
    case ACTIONS.SET_TASK_METADATA:
      return { ...state, taskMetadata: action.payload }
    case ACTIONS.SET_USER_TASKS:
      return {...state, userTasks: action.payload }
    default:
      throw new Error(`Unknown type: ${action.type}`)
  }
}

const CyborgContext = React.createContext()

const CyborgContextProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [tasks, setTasks] = useState(undefined)

  /*
  useEffect(() => {
    if (api && api.query.system) {
      const subscribeToEvents = async () => {
        const unsubscribe = await api.query.system.events(events => {
          events.forEach(({ event }) => {
            if (
              event.section === 'taskManagement' &&
              event.method === 'TaskScheduled'
            ) {
              console.log('Task Scheduled event: ', event.data.toHuman())
              const { assignedWorker, taskId } = event.data.toHuman()
              const [taskExecutor, workerId] = assignedWorker
              setTaskMetadata(taskExecutor, workerId.toString(), taskId)
            }

            if (event.section === 'edgeConnect') {
              console.log('Edge Connect Worker Event')
            }
            if (
              event.section === 'edgeConnect' &&
              (event.method === 'WorkerRegistered' ||
                event.method === 'WorkerRemoved')
            ) {
              const normalizedEvent = event.data.toHuman()
              console.log('Worker Registered Event: ', normalizedEvent)
              setReloadWorkers(true)
            }
          })
        })

        return () => {
          unsubscribe()
        }
      }

      const unsubscribePromise = subscribeToEvents()

      return () => {
        unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe())
      }
    }
  }, [api])
  */

  const selectService = service => {
    dispatch({ type: ACTIONS.SELECT_SERVICE, payload: service })
  }

  const setTaskStatus = deployTask => {
    dispatch({
      type: ACTIONS.DEPLOY_SERVICE,
      payload: { ...state.serviceStatus, deployTask },
    })
  }

  const setDeployComputeStatus = deployCompute => {
    dispatch({
      type: ACTIONS.DEPLOY_SERVICE,
      payload: { ...state.serviceStatus, deployCompute },
    })
  }

  const listWorkers = list => {
    dispatch({ type: ACTIONS.LIST_WORKERS, payload: list })
  }

  /*
  const setUserTasks = userTasks => {
    dispatch({ type: ACTIONS.SET_USER_TASKS, payload: userTasks })
  }
  */

  const addUserTask = taskId => {
    let currentUserTasks;
    if(state.userTasks){
      currentUserTasks = [...state.userTasks, taskId]
    }else{
      currentUserTasks = [taskId];
    }
    dispatch({ type: ACTIONS.SET_USER_TASKS, payload: currentUserTasks})
  }

  return (
    <CyborgContext.Provider
      value={{
        state,
        selectService,
        addUserTask,
        setTaskStatus,
        setTaskMetadata,
        setDeployComputeStatus,
        listWorkers,
      }}
    >
      {props.children}
    </CyborgContext.Provider>
  )
}

const useCyborg = () => useContext(CyborgContext)
const useCyborgState = () => useContext(CyborgContext).state

export { CyborgContextProvider, useCyborg, useCyborgState }

import React, {
  useReducer,
  useState,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { useSubstrateState } from '../substrate-lib'
import { i32CoordinateToFloatCoordinate } from './util/coordinateConversion'
import comingsoon from '../../public/assets/icons/comingsoon.svg'
import cyberdock from '../../public/assets/icons/cyberdock.svg'
import neurozk from '../../public/assets/icons/neuro-zk.svg'
import { getAccount } from './util/getAccount'

export const SERVICES = {
  NO_SERVICE: {id: "0", name: "No service selected", icon: comingsoon, substrateEnumValue: null},
  CYBER_DOCK: {id: "CYBER_DOCK", name: "Cyber Dock", icon: cyberdock, substrateEnumValue: "docker"},
  EXECUTABLE: {id: "EXECUTABLE", name: "Executable", icon: neurozk, substrateEnumValue: "executable"}
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
  const { api, apiState, currentAccount } = useSubstrateState()
  const [tasks, setTasks] = useState(undefined)
  const [workers, setWorkers] = useState({workerClusters: [], executableWorkers: []})
  const [reloadWorkers, setReloadWorkers] = useState(false)
  const { taskMetadata } = state

  // Get tasks owned by user
  useEffect(() => {
    const getUserOwnedTasks = async () => {
      try{
        const allTasks = await api.query.taskManagement.taskOwners.entries()
        const userAccount = await getAccount(currentAccount);
        const userAddress = userAccount[0];
        const userOwnedTasks = allTasks
          .map(([key, value]) => {
            const currentTaskOwner = value.toHuman();

            if(currentTaskOwner === userAddress){
              return parseInt(key.toHuman()[0]);
            }
        })
        setUserTasks(userOwnedTasks)
        console.log(userOwnedTasks)
      } catch(error){
        console.log("Something went wrong when getting users tasks", error)
      }
    }
    if (currentAccount && api && apiState === 'READY') {
      getUserOwnedTasks()
    }
  }, [api, apiState, currentAccount, reloadWorkers])

  // Get tasks and workers from the chain
  useEffect(() => {
    console.log('reload workers: ', reloadWorkers)
    const getTaskAllocations = async () => {
      const entries = await api.query.taskManagement.taskAllocations.entries()
      const assignees = entries
        .map(([key, value]) => {
          const [taskExecutor, workerId] = value.toHuman()
          return {
            taskExecutor,
            workerId,
            taskId: Number(key.toHuman()[0]),
          }
        })
        .sort((a, b) => a.taskId - b.taskId)
      console.log('assignees: ', assignees)
      setTasks(assignees)
    }
    if (api && apiState === 'READY') {
      getTaskAllocations()
    }
  }, [api, apiState])

  useEffect(() => {
    const getRegisteredWorkers = async () => {
      const worker_cluster_entries = await api.query.edgeConnect.workerClusters.entries()
      // Extract and process the worker clusters
      const workerClusters = worker_cluster_entries.map(([key, value]) => {
        return { ...value.toHuman(), lastTask: null }
      })
      console.log('WORKER_CLUSTERS RETREIVED:: ', workerClusters)
      setWorkers({...workers, workerClusters: workerClusters})
      const executbale_worker_entries = await api.query.edgeConnect.executableWorkers.entries()
      // Extract and process the worker clusters
      const executableWorkers = executbale_worker_entries.map(([key, value]) => {
        return { ...value.toHuman(), lastTask: null }
      })
      console.log('EXECUTABLE_WORKERS RETREIVED:: ', workerClusters)
      setWorkers({...workers, executableWorkers: executableWorkers})

    }
    if ((api && apiState === 'READY') || reloadWorkers) {
      getRegisteredWorkers()
      setReloadWorkers(false)
    }
  }, [api, apiState, reloadWorkers])

  const workersWithLastTasks = useMemo(() => {
    let workerClusters = undefined;
    let executableWorkers = undefined;

    if (workers.workerClusters && tasks) {
      // console.log("task with workers: ", workers,tasks)
      workerClusters = workers.workerClusters.map(worker => {
        if (
          isNaN(worker.location.latitue) &&
          isNaN(worker.location.longitude)
        ) {
          worker.location.latitude = i32CoordinateToFloatCoordinate(
            worker.location.latitude
          )
          worker.location.longitude = i32CoordinateToFloatCoordinate(
            worker.location.longitude
          )
        }
        // tasks are iterated through reverse order to find the most recent task for a worker
        for (let i = tasks.length - 1; i >= 0; i--) {
          const { taskExecutor, workerId } = tasks[i]
          // find a match from registered worker's address and id to the task assignee's address and id
          if (worker.owner === taskExecutor && worker.id === workerId) {
            return {
              ...worker,
              lastTask: i,
            }
          }
        }
        return worker // no tasks assigned to this worker
      })
    }

    if (workers.executableWorkers && tasks) {
      // console.log("task with workers: ", workers,tasks)
      executableWorkers = workers.executableWorkers.map(worker => {
        if (
          isNaN(worker.location.latitue) &&
          isNaN(worker.location.longitude)
        ) {
          worker.location.latitude = i32CoordinateToFloatCoordinate(
            worker.location.latitude
          )
          worker.location.longitude = i32CoordinateToFloatCoordinate(
            worker.location.longitude
          )
        }
        // tasks are iterated through reverse order to find the most recent task for a worker
        for (let i = tasks.length - 1; i >= 0; i--) {
          const { taskExecutor, workerId } = tasks[i]
          // find a match from registered worker's address and id to the task assignee's address and id
          if (worker.owner === taskExecutor && worker.id === workerId) {
            return {
              ...worker,
              lastTask: i,
            }
          }
        }
        return worker // no tasks assigned to this worker
      })
    }
    return {workerClusters, executableWorkers}
  }, [workers, tasks])
  console.log('Workers with tasks: ', workersWithLastTasks)

  // keep last executed task info in storage if not present
  useEffect(() => {
    if (
      (!taskMetadata && tasks) ||
      (taskMetadata && tasks && taskMetadata.taskId < tasks.length - 1)
    ) {
      dispatch({
        type: ACTIONS.SET_TASK_METADATA,
        payload: {
          ...tasks[tasks.length - 1],
        },
      })
    }
  }, [taskMetadata, tasks])

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

  const selectService = service => {
    dispatch({ type: ACTIONS.SELECT_SERVICE, payload: service })
  }

  const setTaskStatus = deployTask => {
    dispatch({
      type: ACTIONS.DEPLOY_SERVICE,
      payload: { ...state.serviceStatus, deployTask },
    })
  }

  const setTaskMetadata = (taskExecutor, workerId, taskId) => {
    setTasks([
      ...tasks,
      {
        taskExecutor,
        workerId,
        taskId,
      },
    ])
    console.log('new Tasks: ', tasks)
    console.log('task metadata: ', {
      taskExecutor,
      workerId,
      taskId,
    })
    dispatch({
      type: ACTIONS.SET_TASK_METADATA,
      payload: {
        taskExecutor,
        workerId,
        taskId,
      },
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

  const setUserTasks = userTasks => {
    dispatch({ type: ACTIONS.SET_USER_TASKS, payload: userTasks })
  }

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
        workersWithLastTasks,
        setReloadWorkers,
      }}
    >
      {props.children}
    </CyborgContext.Provider>
  )
}

const useCyborg = () => useContext(CyborgContext)
const useCyborgState = () => useContext(CyborgContext).state

export { CyborgContextProvider, useCyborg, useCyborgState }

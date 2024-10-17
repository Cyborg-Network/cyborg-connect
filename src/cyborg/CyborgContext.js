import React, {
  useReducer,
  useState,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { useSubstrateState } from '../substrate-lib'
import { i32CoordinateToFloatCoordinate } from './util/coordinateConversion'
import cyberdock from '../../public/assets/icons/cyberdock.png'

export const SERVICES = {
  CYBER_DOCK: { id: 'CYBER_DOCK', name: "Cyber Dock", icon: cyberdock },
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
}

///
// Actions types for 'useReducer`
const ACTIONS = {
  SELECT_SERVICE: 'SELECT_SERVICE',
  DEPLOY_SERVICE: 'DEPLOY_SERVICE',
  LIST_WORKERS: 'LIST_WORKERS',
  LIST_TASKS: 'LIST_TASKS',
  SET_TASK_METADATA: 'SET_TASK_METADATA',
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
    default:
      throw new Error(`Unknown type: ${action.type}`)
  }
}

const CyborgContext = React.createContext()

const CyborgContextProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { api, apiState } = useSubstrateState()
  const [tasks, setTasks] = useState(undefined)
  const [workers, setWorkers] = useState(undefined)
  const [reloadWorkers, setReloadWorkers] = useState(false)
  const { taskMetadata } = state

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
      const entries = await api.query.edgeConnect.workerClusters.entries()
      // Extract and process the worker clusters
      const workerClusters = entries.map(([key, value]) => {
        return { ...value.toHuman(), lastTask: null }
      })
      console.log('WORKERS RETREIVED:: ', workerClusters)
      setWorkers(workerClusters)
    }
    if ((api && apiState === 'READY') || reloadWorkers) {
      getRegisteredWorkers()
      setReloadWorkers(false)
    }
  }, [api, apiState, reloadWorkers])

  const workersWithLastTasks = useMemo(() => {
    if (workers && tasks) {
      // console.log("task with workers: ", workers,tasks)
      return workers.map(worker => {
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

  return (
    <CyborgContext.Provider
      value={{
        state,
        selectService,
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

import React, { useReducer, useContext } from 'react'

import { TaskId } from './types/task'

//TODO: Currently most of this is not used. However the functionality is still there, because it might be needed with future parachain updates (eg. for keeping track of deployed tasks in the background via event subscription), but Zustand might be a better lib for that

export const DEPLOY_STATUS = {
  PENDING: 'PENDING',
  READY: 'READY',
  FAILED: 'FAILED',
}

///
// Initial state for `useReducer`

const initialState = {
  // These are the states
  serviceStatus: {
    deployCompute: null,
    deployTask: null,
  },
  userTasks: null,
}

///
// Actions types for 'useReducer`
const ACTIONS = {
  DEPLOY_SERVICE: 'DEPLOY_SERVICE',
  SET_USER_TASKS: 'SET_USER_TASKS',
}

///
// Reducer function for `useReducer`

const reducer = (state, action) => {
  console.log('cyborg action: ', action)
  console.log('cyborg state: ', state)
  switch (action.type) {
    case ACTIONS.DEPLOY_SERVICE:
      return { ...state, serviceStatus: action.payload }
    case ACTIONS.SET_USER_TASKS:
      return { ...state, userTasks: action.payload }
    default:
      throw new Error(`Unknown type: ${action.type}`)
  }
}

const CyborgContext = React.createContext(undefined)

const CyborgContextProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState)

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

  const addUserTask = (taskId: TaskId) => {
    let currentUserTasks
    if (state.userTasks) {
      currentUserTasks = [...state.userTasks, taskId]
    } else {
      currentUserTasks = [taskId]
    }
    dispatch({ type: ACTIONS.SET_USER_TASKS, payload: currentUserTasks })
  }

  return (
    <CyborgContext.Provider
      value={{
        state,
        addUserTask,
        setTaskStatus,
        setDeployComputeStatus,
      }}
    >
      {props.children}
    </CyborgContext.Provider>
  )
}

const useCyborg = () => useContext(CyborgContext)
const useCyborgState = () => useContext(CyborgContext).state

export { CyborgContextProvider, useCyborg, useCyborgState }

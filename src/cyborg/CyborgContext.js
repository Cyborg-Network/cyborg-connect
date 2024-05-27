import React, { useReducer, useContext, useEffect } from 'react'
import { useSubstrateState } from '../substrate-lib'

export const SERVICES = {
  CYBER_DOCK: 'CYBER_DOCK'
}

export const DEPLOY_STATUS = {
  PENDING: 'PENDING',
  READY: 'READY',
  FAILED: 'FAILED'
}

export const DASH_STATE = {
  HOME: 'HOME',
  SERVER: 'SERVER'
}

///
// Initial state for `useReducer`
  
const initialState = {
  // These are the states
    selectedPath: null,
    devMode: false,
    service: null,
    serviceStatus: {
      deployCompute: null,
      deployTask: null
    },
    //determines dashboard sections
    dashboard: {
      section: null,
      //provides information on nodes
      metadata: null
    },
    workerList: null,
    taskMetadata: null
}

///
// Actions types for 'useReducer`
const ACTIONS = {
    RESET_PATH: 'RESET_PATH',
    SELECT_PROVIDER: 'SELECT_PROVIDER',
    SELECT_ACCESSOR: 'SELECT_ACCESSOR',
    TOGGLE_DEV_MODE: 'TOGGLE_DEV_MODE',
    SELECT_SERVICE: 'SELECT_SERVICE',
    DEPLOY_SERVICE: 'DEPLOY_SERVICE',
    LIST_WORKERS: 'LIST_WORKERS',
    TOGGLE_DASHBOARD: 'TOGGLE_DASHBOARD',
    SET_TASK_METADATA: 'SET_TASK_METADATA'
}

///
// Reducer function for `useReducer`

const reducer = (state, action) => {
  console.log("cyborg action: ", action)
  console.log("cyborg state: ", state)
  switch (action.type) {
    case ACTIONS.SELECT_PROVIDER:
      return { ...state, selectedPath: 'PROVIDER' }
    case ACTIONS.SELECT_ACCESSOR:
      return { ...state, selectedPath: 'ACCESSOR' }
    case ACTIONS.TOGGLE_DEV_MODE:
      return { ...state, devMode: action.payload }
    case ACTIONS.RESET_PATH:
    return { ...state, devMode: null }
    case ACTIONS.SELECT_SERVICE:
      return { ...state, service: action.payload }
    case ACTIONS.DEPLOY_SERVICE:
      return { ...state, serviceStatus: action.payload }
    case ACTIONS.LIST_WORKERS:
      return { ...state, workerList: action.payload }
    case ACTIONS.TOGGLE_DASHBOARD:
      return { ...state, dashboard: action.payload }
    case ACTIONS.SET_TASK_METADATA:
      return { ...state, taskMetadata: action.payload }
    default:
      throw new Error(`Unknown type: ${action.type}`)
  }
}

const CyborgContext = React.createContext()


const CyborgContextProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { api } = useSubstrateState()

    const { devMode } = state

    useEffect(() => {
      const getRegisteredWorkers = async () => {
          let workers = []
          const count = await api.query.workerRegistration.nextClusterId()
          for (let i = 0; i < count.toNumber(); i++) {
              const worker = await api.query.workerRegistration.workerClusters(i)
              workers.push(worker.toHuman()) 
          }
          listWorkers(workers)
      }
      getRegisteredWorkers()
    },[])

    const toggleDevMode = () => {
        dispatch({ type: ACTIONS.TOGGLE_DEV_MODE, payload: !devMode })
    }

    const provideCompute = () => {
        dispatch({ type: ACTIONS.SELECT_PROVIDER })
    }

    const accessCompute = () => {
        dispatch({ type: ACTIONS.SELECT_ACCESSOR })
    }

    const resetPath = () => {
        dispatch({ type: ACTIONS.RESET_PATH })
    }

    const selectService = (service) => {
      dispatch({ type: ACTIONS.SELECT_SERVICE, payload: service })
    }

    const setTaskStatus = (deployTask) => {
      dispatch({ type: ACTIONS.DEPLOY_SERVICE, payload: { ...state.serviceStatus, deployTask } })
    }

    const setTaskMetadata = (taskEvent) => {
      console.log("set task metadata: ", taskEvent)
      const taskMetadata = {
        taskExecutor: taskEvent[0],
        taskOwner: taskEvent[1],
        taskId: taskEvent[2],
        taskInstruction: taskEvent[3],
        executorIp: taskEvent[4]
      }
      console.log("task metadata: ", taskMetadata)
      dispatch({ type: ACTIONS.SET_TASK_METADATA, payload: taskMetadata })
    }

    const setDeployComputeStatus = (deployCompute) => {
      dispatch({ type: ACTIONS.DEPLOY_SERVICE, payload: { ...state.serviceStatus, deployCompute } })
    }

    const listWorkers = (list) => {
      dispatch({ type: ACTIONS.LIST_WORKERS, payload: list})
    }

    const toggleDashboard = ({section = null, metadata = null}) => {
      const dashInfo = {
        ...state.dashboard,
        ...(section && { section }), 
        ...(metadata && { metadata }), 
      };
      dispatch({ type: ACTIONS.TOGGLE_DASHBOARD, payload: dashInfo})
    }

  return (
    <CyborgContext.Provider value={{ state, resetPath, toggleDevMode, toggleDashboard, provideCompute, accessCompute, selectService, setTaskStatus, setTaskMetadata, setDeployComputeStatus, listWorkers }}>
      {props.children}
    </CyborgContext.Provider>
  )
}

const useCyborg = () => useContext(CyborgContext)
const useCyborgState = () => useContext(CyborgContext).state

export { CyborgContextProvider, useCyborg, useCyborgState }

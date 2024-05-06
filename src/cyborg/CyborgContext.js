import React, { useReducer, useContext } from 'react'

export const SERVICES = {
  CYBER_DOCK: 'CYBER_DOCK'
}

///
// Initial state for `useReducer`
  
const initialState = {
  // These are the states
    selectedPath: null,
    devMode: false,
    service: null,
    serviceStatus: null
}

///
// Actions types for 'useReducer`
const ACTIONS = {
    RESET_PATH: 'RESET_PATH',
    SELECT_PROVIDER: 'SELECT_PROVIDER',
    SELECT_ACCESSOR: 'SELECT_ACCESSOR',
    TOGGLE_DEV_MODE: 'TOGGLE_DEV_MODE',
    SELECT_SERVICE: 'SELECT_SERVICE',
    DEPLOY_SERVICE: 'DEPLOY_SERVICE'
}

///
// Reducer function for `useReducer`

const reducer = (state, action) => {
  console.log("actions: ", action)
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
    default:
      throw new Error(`Unknown type: ${action.type}`)
  }
}

const CyborgContext = React.createContext()


const CyborgContextProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState)
    const { devMode } = state

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

  return (
    <CyborgContext.Provider value={{ state, resetPath, toggleDevMode, provideCompute, accessCompute, selectService }}>
      {props.children}
    </CyborgContext.Provider>
  )
}

const useCyborg = () => useContext(CyborgContext)
const useCyborgState = () => useContext(CyborgContext).state

export { CyborgContextProvider, useCyborg, useCyborgState }

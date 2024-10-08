import React, { useReducer, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import jsonrpc from '@polkadot/types/interfaces/jsonrpc'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { keyring as Keyring } from '@polkadot/ui-keyring'
import { isTestChain } from '@polkadot/util'
import { TypeRegistry } from '@polkadot/types/create'

import config from '../config'
import { toast } from 'react-hot-toast'
const SOCKETS = {
  //RELAY_DEV: 'wss://rococo-rpc.polkadot.io',
  CYBORG: 'wss://fraa-flashbox-4478-rpc.a.stagenet.tanssi.network',
  LOCAL: 'ws://127.0.0.1:9988' //change to 'ws://127.0.0.1:9944' if using solochain
}
const CHAIN = {
  //RELAY_DEV: 'Roccoco',
  CYBORG: 'Cyborg Hosted',
  LOCAL: 'Local Chain'
}

const parsedQuery = new URLSearchParams(window.location.search)
const connectedSocket = parsedQuery.get('rpc') || config.SOCKET_PROVIDER || SOCKETS.CYBORG
///
// Initial state for `useReducer`

const initialState = {
  // These are the states
  socket: connectedSocket,
  jsonrpc: { ...jsonrpc, ...config.CUSTOM_RPC_METHODS },
  keyring: null,
  keyringState: null,
  api: null,
  apiError: null,
  apiState: null,
  currentAccount: null,
  chain: CHAIN.CYBORG
}

const registry = new TypeRegistry()

///
// Reducer function for `useReducer`

const reducer = (state, action) => {
  console.log("action: ", action)
  console.log("state: ", state)
  switch (action.type) {
    case 'SWITCH_PROVIDER':
      return { ...initialState, apiState: 'SWITCH_PROVIDER', socket: action.payload.socket, chain: action.payload.chain }
    case 'CONNECT_INIT':
      return { ...state, apiState: 'CONNECT_INIT' }
    case 'CONNECT':
      return { ...state, api: action.payload, apiState: 'CONNECTING' }
    case 'CONNECT_SUCCESS':
      return { ...state, apiState: 'READY' }
    case 'CONNECT_ERROR':
      return { ...state, apiState: 'ERROR', apiError: action.payload }
    case 'LOAD_KEYRING':
      return { ...state, keyringState: 'LOADING' }
    case 'SET_KEYRING':
      return { ...state, keyring: action.payload, keyringState: 'READY' }
    case 'KEYRING_ERROR':
      return { ...state, keyring: null, keyringState: 'ERROR' }
    case 'SET_CURRENT_ACCOUNT':
      return { ...state, currentAccount: action.payload }
    default:
      throw new Error(`Unknown type: ${action.type}`)
  }
}

///
// Connecting to the Substrate node

const connect = (state, dispatch) => {
  const { apiState, socket, jsonrpc } = state
  // We only want this function to be performed once
  if (!(apiState == null || apiState === 'SWITCH_PROVIDER')) return

  dispatch({ type: 'CONNECT_INIT' })

  console.log(`Connected socket: ${socket}`)
  const provider = new WsProvider(socket)
  const _api = new ApiPromise({ provider, rpc: jsonrpc })

  console.log('api: ', _api)
  console.log('jsonrpc: ', jsonrpc)

  // Set listeners for disconnection and reconnection event.
  _api.on('connected', () => {
    dispatch({ type: 'CONNECT', payload: _api })
    // `ready` event is not emitted upon reconnection and is checked explicitly here.
    _api.isReady.then(_api => dispatch({ type: 'CONNECT_SUCCESS' }))
  })
  _api.on('ready', () => dispatch({ type: 'CONNECT_SUCCESS' }))
  _api.on('error', err => {
    toast(`Error connecting to socket ${socket}, switching back to default socket.`)
    dispatch({ type: 'CONNECT_ERROR', payload: err })
    if(socket !== SOCKETS.CYBORG)
    setTimeout(() => {
      dispatch({ type: 'SWITCH_PROVIDER', payload: { socket: SOCKETS.CYBORG, chain: CHAIN.CYBORG } })
      sessionStorage.setItem('CHAIN', CHAIN.CYBORG);
      window.location.reload(true)
    }, 1500)
  })
}

const retrieveChainInfo = async api => {
  const [systemChain, systemChainType] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.chainType
      ? api.rpc.system.chainType()
      : Promise.resolve(registry.createType('ChainType', 'Live')),
  ])

  return {
    systemChain: (systemChain || '<unknown>').toString(),
    systemChainType,
  }
}

///
// Loading accounts from dev and polkadot-js extension
const loadAccounts = (state, dispatch) => {
  const { api } = state
  dispatch({ type: 'LOAD_KEYRING' })

  const asyncLoadAccounts = async () => {
    try {
      await web3Enable(config.APP_NAME)
      let allAccounts = await web3Accounts()

      allAccounts = allAccounts.map(({ address, meta }) => ({
        address,
        meta: { ...meta, name: `${meta.name} (${meta.source})` },
      }))

      // Logics to check if the connecting chain is a dev chain, coming from polkadot-js Apps
      // ref: https://github.com/polkadot-js/apps/blob/15b8004b2791eced0dde425d5dc7231a5f86c682/packages/react-api/src/Api.tsx?_pjax=div%5Bitemtype%3D%22http%3A%2F%2Fschema.org%2FSoftwareSourceCode%22%5D%20%3E%20main#L101-L110
      const { systemChain, systemChainType } = await retrieveChainInfo(api)
      const isDevelopment =
        systemChainType.isDevelopment ||
        systemChainType.isLocal ||
        isTestChain(systemChain)

      Keyring.loadAll({ isDevelopment }, allAccounts)

      dispatch({ type: 'SET_KEYRING', payload: Keyring })
    } catch (e) {
      console.error(e)
      dispatch({ type: 'KEYRING_ERROR' })
    }
  }
  asyncLoadAccounts()
}

const SubstrateContext = React.createContext()

let keyringLoadAll = false

const SubstrateContextProvider = props => {
  const neededPropNames = ['socket']
  neededPropNames.forEach(key => {
    initialState[key] =
      typeof props[key] === 'undefined' ? initialState[key] : props[key]
  })

  const [state, dispatch] = useReducer(reducer, initialState)

  // if (apiState) return
  const SelectedChain = sessionStorage.getItem('CHAIN')
  // check if existing session
  if (SelectedChain && SelectedChain !== state.chain) {
    switch(SelectedChain) {
      /*
      case CHAIN.RELAY_DEV:
        dispatch({ type: 'SWITCH_PROVIDER', payload: { socket: SOCKETS.RELAY_DEV, chain: CHAIN.RELAY_DEV } })
      break;
      */
      case CHAIN.CYBORG:
        dispatch({ type: 'SWITCH_PROVIDER', payload: { socket: SOCKETS.CYBORG, chain: CHAIN.CYBORG } })
      break;
      case CHAIN.LOCAL:
        dispatch({ type: 'SWITCH_PROVIDER', payload: { socket: SOCKETS.LOCAL, chain: CHAIN.LOCAL } })
      break;
      default:
      }
  } 

  useEffect(() => {
    const { apiState, keyringState, api } = state
    if (apiState === 'READY' && !keyringState && !keyringLoadAll) {
      keyringLoadAll = true
      loadAccounts(state, dispatch)
    }
    if (apiState === null || api === null) {
      connect(state, dispatch)
    }
  }, [state, dispatch])

  function setCurrentAccount(acct) {
    dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: acct })
  }

  /*
  function setRelaychainProvider() {
    dispatch({ type: 'SWITCH_PROVIDER', payload: { socket: SOCKETS.RELAY_DEV, chain: CHAIN.RELAY_DEV } })
    sessionStorage.setItem('CHAIN', CHAIN.RELAY_DEV);
    window.location.reload(true)
  }
  */

  function setCyborgProvider() {
    dispatch({ type: 'SWITCH_PROVIDER', payload: { socket: SOCKETS.CYBORG, chain: CHAIN.CYBORG } })
    sessionStorage.setItem('CHAIN', CHAIN.CYBORG);
    window.location.reload(true)
  }

  function setLocalProvider() {
    dispatch({ type: 'SWITCH_PROVIDER', payload: { socket: SOCKETS.LOCAL, chain: CHAIN.LOCAL } }) 
    sessionStorage.setItem('CHAIN', CHAIN.LOCAL);
    window.location.reload(true)
  }

  return (
    <SubstrateContext.Provider value={{ state, setCurrentAccount, /*setRelaychainProvider,*/ setCyborgProvider, setLocalProvider }}>
      {props.children}
    </SubstrateContext.Provider>
  )
}

// prop typechecking
SubstrateContextProvider.propTypes = {
  socket: PropTypes.string,
}

const useSubstrate = () => useContext(SubstrateContext)
const useSubstrateState = () => useContext(SubstrateContext).state

export { SubstrateContextProvider, useSubstrate, useSubstrateState }

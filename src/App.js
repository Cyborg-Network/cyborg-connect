import React, { createRef, useState } from 'react'
import {
  Container,
  Dimmer,
  Loader,
  Grid,
  Sticky,
  Message,
  Button,
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import { SubstrateContextProvider, useSubstrateState } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'

import AccountSelector from './AccountSelector'
import Balances from './Balances'
import BlockNumber from './BlockNumber'
import Events from './Events'
import Interactor from './Interactor'
import Metadata from './Metadata'
import NodeInfo from './NodeInfo'
import TemplateModule from './TemplateModule'
import Transfer from './Transfer'
import Upgrade from './Upgrade'
import CyborgDapp from './cyborg'
import { CyborgContextProvider } from './cyborg/CyborgContext'
import RpcSelector from './cyborg/components/utils/RpcSelector'

import { Toaster } from 'react-hot-toast';

function Main() {
  const { apiState, apiError, keyringState } = useSubstrateState()

  const loader = text => (
    <Dimmer active>
      <Loader size="small">{text}</Loader>
    </Dimmer>
  )

  const message = errObj => (
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message
          negative
          compact
          floating
          header="Error Connecting to Substrate"
          content={`Connection to websocket '${errObj.target.url}' failed.`}
        />
      </Grid.Column>
    </Grid>
  )


  if (apiState === 'ERROR') return message(apiError)
  else if (apiState !== 'READY') return loader('Connecting to Substrate')

  if (keyringState !== 'READY') {
    return loader(
      "Loading accounts (please review any extension's authorization)"
    )
  }

  const contextRef = createRef()

  return (
    <div ref={contextRef}>
      <Sticky context={contextRef}>
        <AccountSelector />
      </Sticky>
      <Container>
        <Grid stackable columns="equal">
          <Grid.Row stretched>
            <NodeInfo />
            <Metadata />
            <BlockNumber />
            <BlockNumber finalized />
          </Grid.Row>
          <Grid.Row stretched>
            <Balances />
          </Grid.Row>
          <Grid.Row>
            <Transfer />
            <Upgrade />
          </Grid.Row>
          <Grid.Row>
            <Interactor />
            <Events />
          </Grid.Row>
          <Grid.Row>
            <TemplateModule />
          </Grid.Row>
        </Grid>
      </Container>
      <DeveloperConsole />
    </div>
  )
}

export default function App() {
  const [ devMode, setDevMode ] = useState(false)

  return (
    <SubstrateContextProvider>
      <CyborgContextProvider>
        <div className='relative w-screen h-screen'>
          <div className={`${devMode?'hidden':''}`}>
            <CyborgDapp />
          </div>
          
          <div className={`${!devMode?'hidden':''}`}>
            <Main/>
          </div> 

          <Button className='fixed bottom-2 right-2 z-40' onClick={()=>{setDevMode(!devMode)}}>{ !devMode? 'Test Substrate Chain': 'Test Cyborg Dapp'}</Button>
          <div className='fixed -bottom-2 left-1/2 transform -translate-x-1/2 z-30'><RpcSelector /></div>
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        </CyborgContextProvider>
    </SubstrateContextProvider>
  )
}

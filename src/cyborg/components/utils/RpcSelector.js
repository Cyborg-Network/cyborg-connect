import React from 'react'
import { MenuItem, Menu, Segment } from 'semantic-ui-react'
import {
  useSubstrate,
  useSubstrateState,
} from '../../../substrate-lib/SubstrateContext'

function RpcSelector() {
  const { setRelaychainProvider, setCyborgProvider, setLocalProvider } =
    useSubstrate()
  const { chain } = useSubstrateState()

  function handleItemClick(e, { name }) {
    if (name === chain) return

    switch (name) {
      case 'Cyborg Hosted':
        setCyborgProvider()
        break
      case 'Local Chain':
        setLocalProvider()
        break
      default:
        setRelaychainProvider()
    }
  }
  return (
    <Segment inverted>
      <Menu inverted secondary>
        <MenuItem
          name="Roccoco"
          active={chain === 'Roccoco'}
          onClick={handleItemClick}
        />
        <MenuItem
          name="Cyborg Hosted"
          active={chain === 'Cyborg Hosted'}
          onClick={handleItemClick}
        />
        <MenuItem
          name="Local Chain"
          active={chain === 'Local Chain'}
          onClick={handleItemClick}
        />
      </Menu>
    </Segment>
  )
}

export default RpcSelector

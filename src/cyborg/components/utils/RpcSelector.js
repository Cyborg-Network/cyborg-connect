import React, { useState } from 'react'
import { MenuItem, Menu, Segment } from 'semantic-ui-react'
import { useSubstrate } from '../../../substrate-lib/SubstrateContext'

function RpcSelector() {
    const { setRelaychainProvider, setCyborgProvider, setLocalProvider } = useSubstrate()
    const [rpc, setRPC] =useState('Roccoco')
    function handleItemClick(e, { name }) {
        setRPC(name)
        switch (name) {
            case 'Cyborg Hosted':
                setCyborgProvider()
                break;
            case 'Local Chain': 
                setLocalProvider()
                break;
            default:
                setRelaychainProvider()
        }
    } 
  return (
    <Segment inverted>
        <Menu inverted secondary>
        <MenuItem
            name='Roccoco'
            active={rpc === 'Roccoco'}
            onClick={handleItemClick}
        />
        <MenuItem
            name='Cyborg Hosted'
            active={rpc === 'Cyborg Hosted'}
            onClick={handleItemClick}
        />
        <MenuItem
            name='Local Chain'
            active={rpc === 'Local Chain'}
            onClick={handleItemClick}
        />
        </Menu>
    </Segment>
  )
}

export default RpcSelector


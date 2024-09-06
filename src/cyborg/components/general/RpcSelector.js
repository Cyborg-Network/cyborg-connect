import React, { useState } from 'react'
import {
  useSubstrate,
  useSubstrateState,
} from '../../../substrate-lib/SubstrateContext'
import { SlArrowUp } from 'react-icons/sl'

function RpcSelector() {
  const { setRelaychainProvider, setCyborgProvider, setLocalProvider } =
    useSubstrate()
  const { chain } = useSubstrateState()

  const [dropdownIsOpen, setDropdownIsOpen] = useState(false)

  const rpcItems = ['Roccoco', 'Cyborg Hosted', 'Local Chain']

  const handleMenuItemClick = item => {
    if (item === chain) return

    switch (item) {
      case 'Cyborg Hosted':
        setCyborgProvider()
        break
      case 'Local Chain':
        setLocalProvider()
        break
      default:
        setRelaychainProvider()
    }

    setDropdownIsOpen(false)
  }

  const handleDropdownClick = () => {
    setDropdownIsOpen(!dropdownIsOpen)
  }

  const MenuItem = ({ name, onClick, additionalStyles }) => {
    return (
      <div
        className={`p-3 rounded-xl ${additionalStyles}`}
        onClick={() => onClick(name)}
      >
        {name}
      </div>
    )
  }

  const DropdownButton = ({ name, onClick }) => {
    return (
      <div
        className="text-white bg-cb-gray-400 p-3 rounded-xl"
        onClick={() => onClick()}
      >
        <div className="flex items-center gap-2">
          {name}
          <SlArrowUp />
        </div>
      </div>
    )
  }

  return (
    <>
      {window.innerWidth < 768 ? (
        <div className="flex flex-col rounded-lg p-1 bg-cb-gray-600">
          {dropdownIsOpen ? (
            rpcItems
              .filter(item => item !== chain)
              .map((item, index) => (
                <MenuItem
                  name={item}
                  key={index}
                  onClick={handleMenuItemClick}
                  additionalStyles="text-gray-400 bg-cb-gray-600"
                />
              ))
          ) : (
            <></>
          )}
          <DropdownButton name={chain} onClick={handleDropdownClick} />
        </div>
      ) : (
        <div className="flex rounded-lg p-1 bg-cb-gray-600">
          {rpcItems.map((item, index) => (
            <MenuItem
              additionalStyles={
                chain === item
                  ? 'text-white bg-cb-gray-400'
                  : 'text-gray-400 bg-cb-gray-600'
              }
              name={item}
              key={index}
              onClick={handleMenuItemClick}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default RpcSelector

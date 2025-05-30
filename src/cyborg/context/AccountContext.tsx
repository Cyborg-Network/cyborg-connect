import React, { useEffect } from 'react'
import { useSubstrateState, useSubstrate } from '../../substrate-lib'

//TODO: Not in use right now, as SubstrateContext provides the same functionality. This is here in case we want to move off of the substrate-frontend-template in the future
interface AccountContextType {}

const AccountContext = React.createContext<AccountContextType | undefined>(
  undefined
)

const AccountContextProvider = props => {
  const { keyringState } = useSubstrateState()

  const {
    setCurrentAccount,
    state: { keyring, currentAccount },
  } = useSubstrate()

  // Set the initial address
  useEffect(() => {
    // `setCurrentAccount()` is called only when currentAccount is null (uninitialized)
    if (keyringState === 'READY') {
      // Get the list of accounts we possess the private key for
      const keyringOptions = keyring.getPairs().map(account => ({
        key: account.address,
        value: account.address,
        text: account.meta.name.toUpperCase(),
        icon: 'user',
      }))

      const initialAddress =
        keyringOptions.length > 0 ? keyringOptions[0].value : ''

      !currentAccount &&
        initialAddress.length > 0 &&
        setCurrentAccount(keyring.getPair(initialAddress))
    }
  }, [currentAccount, setCurrentAccount, keyring, keyringState])

  return (
    <AccountContext.Provider value={{}}>
      {props.children}
    </AccountContext.Provider>
  )
}

export { AccountContextProvider }

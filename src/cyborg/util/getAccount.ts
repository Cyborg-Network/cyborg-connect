import {
  /* web3FromSource,*/ web3Enable,
  web3FromAddress,
  web3Accounts,
} from '@polkadot/extension-dapp'
import { AccountId32 } from '@polkadot/types/interfaces'
import { toast } from 'react-hot-toast'

export const getAccount = async (currentAccount: AccountId32) => {
  if (currentAccount) {
    //const {
    //address,
    //meta: { source, isInjected },
    //} = currentAccount

    //if (!isInjected) {
    //console.log(currentAccount);
    //return [currentAccount]
    //}

    console.log(currentAccount)

    // Ensure wallet is enabled (prompts the user if needed)
    //const extensions = await web3Enable('Cyborg Connect');
    //const extension = extensions.find(ext => ext.name === source);
    //if (!extension) {
    //toast('Please connect your wallet!');
    //return null;
    //}

    const extensions = await web3Enable('Cyborg Connect')

    if (extensions.length === 0) {
      throw new Error(
        'No wallet extension found. Please install Polkadot.js or Talisman.'
      )
    }
    const accounts = await web3Accounts()
    if (accounts.length === 0) {
      throw new Error(
        'No accounts found. Please ensure you have an account in your wallet.'
      )
    }
    // Get the first account (or modify logic here for other specific account selections)
    const selectedAccount = accounts[0]
    const address = selectedAccount.address

    // currentAccount is injected from polkadot-JS extension, need to return the addr and signer object.
    // ref: https://polkadot.js.org/docs/extension/cookbook#sign-and-send-a-transaction
    //const injector = await web3FromSource(source)
    const injector = await web3FromAddress(address)
    return [address, { signer: injector.signer }]
  } else {
    toast('Please connect your wallet!')
    return null
  }
}

import { web3FromSource } from '@polkadot/extension-dapp'
import { toast } from 'react-hot-toast'

export const getAccount = async currentAccount => {
  if (currentAccount) {
    const {
      address,
      meta: { source, isInjected },
    } = currentAccount

    if (!isInjected) {
      return [currentAccount]
    }

    // currentAccount is injected from polkadot-JS extension, need to return the addr and signer object.
    // ref: https://polkadot.js.org/docs/extension/cookbook#sign-and-send-a-transaction
    const injector = await web3FromSource(source)
    return [address, { signer: injector.signer }]
  } else {
    toast('Please connect your wallet!')
    return null
  }
}

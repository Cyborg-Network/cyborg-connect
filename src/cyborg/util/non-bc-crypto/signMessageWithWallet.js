import { web3FromAddress } from '@polkadot/extension-dapp'
import { stringToU8a, u8aToHex } from '@polkadot/util'
import { toast } from 'react-hot-toast'

export const signMessageWithWallet = async () => {
  try{
    const address = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"

    const injector = await web3FromAddress(address)

    // Timestamp in seconds
    const message = `${Math.floor(Date.now() / 1000)}`;

    toast('Please sign a message to authenticate with the worker.')

    const { signature } = await injector.signer.signRaw({
      address,
      data: u8aToHex(stringToU8a(message)),
      type: 'bytes',
    })
    
    // Polkadot-js will add this wrapper to the message in the signRaw function, so we need to as well, 
    // otherwise signature verification will fail
    const wrappedMessage = `<Bytes>${message}</Bytes>`;

    return { wrappedMessage, signature }
  } catch(err) {
    if (err.message.includes('cancelled')) {
      toast("User cancelled the signature process.");
    } else {
      toast("An error occurred during the signing process:", err);
    }
  }
}

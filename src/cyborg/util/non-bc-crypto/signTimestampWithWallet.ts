import { web3FromAddress, web3Enable, web3Accounts } from '@polkadot/extension-dapp'
import { stringToU8a, u8aToHex } from '@polkadot/util'
import { toast } from 'react-hot-toast'

export const signTimestampWithWallet = async () => {
  try{
    const extensions = await web3Enable('Your App Name');
    
    if (extensions.length === 0) {
      throw new Error("No wallet extension found. Please install Polkadot.js or Talisman.");
    }

    const accounts = await web3Accounts();

    if (accounts.length === 0) {
      throw new Error('No accounts found. Please ensure you have an account in your wallet.');
    }

    // Get the first account (or modify logic here for other specific account selections)
    const selectedAccount = accounts[0];

    const address = selectedAccount.address

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
    const signedTimestamp = `<Bytes>${message}</Bytes>`;

    return { signedTimestamp, signature }
  } catch(err) {
    if (err.message.includes('cancelled')) {
      toast("User cancelled the signature process.");
    } else {
      toast("An error occurred during the signing process:", err);
    }
  }
}

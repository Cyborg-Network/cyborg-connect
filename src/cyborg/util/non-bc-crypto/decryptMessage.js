import sodium from 'libsodium-wrappers'
import { toast } from 'react-hot-toast';

export const decryptMessage = async (messageData, diffieHellmanSecret) => {
    await sodium.ready;

    if(!diffieHellmanSecret){
      toast("No decryption key found, aborting message decryption.")
      return
    }

    try{
      const [messageType, encryptedDataHex, nonceHex] = messageData.split("|");

      console.log(`Ws message of type ${messageType} received.`)
      console.log(messageData)

      const encryptedData = sodium.from_hex(encryptedDataHex);
      const nonce = sodium.from_hex(nonceHex);

      const decryptedMessage = sodium.crypto_secretbox_open_easy(encryptedData, nonce, diffieHellmanSecret);

      const decryptedText = new TextDecoder().decode(decryptedMessage);

      toast(decryptedText)

      return decryptedText
    } catch (error) {
      console.error('Decryption failed: ', error)
    }
  }

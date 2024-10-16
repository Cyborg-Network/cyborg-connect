import sodium from 'libsodium-wrappers'
import { toast } from 'react-hot-toast';

export const decryptMessage = async (messageData, diffieHellmanSecret) => {
    await sodium.ready;

    console.log(diffieHellmanSecret)
    console.log(messageData)

    if(!diffieHellmanSecret){
      toast("No decryption key found, aborting message decryption.")
      return
    }

    try{
      const [messageType, encryptedDataHex, nonceHex] = messageData.split("|");

      toast(messageType)
      
      const encryptedData = sodium.from_hex(encryptedDataHex);
      const nonce = sodium.from_hex(nonceHex);

      const decryptedMessage = sodium.crypto_secretbox_open_easy(encryptedData, nonce, diffieHellmanSecret);

      const decryptedText = new TextDecoder().decode(decryptedMessage);

      toast(decryptedText)
    } catch (error) {
      console.error('Decryption failed: ', error)
    }
  }

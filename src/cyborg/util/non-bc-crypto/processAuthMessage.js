import sodium from 'libsodium-wrappers'

  export const processAuthMessage = async (messageData, privateKey) => {
    await sodium.ready;

    const nodePubKeyHex = messageData.split("|")[1];
    const nodePubKey = sodium.from_hex(nodePubKeyHex);

    const diffieHellmanSecret = sodium.crypto_scalarmult(privateKey, nodePubKey);

    return diffieHellmanSecret;
  }

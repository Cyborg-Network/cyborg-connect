import sodium from 'libsodium-wrappers'
import { X25519PrivKey } from './generateX25519KeyPair';

export const processDiffieHellmanAuth = async (
  nodePubKeyHex: string, 
  privateKey: X25519PrivKey
) => {
  await sodium.ready;

  const nodePubKey = sodium.from_hex(nodePubKeyHex);

  const diffieHellmanSecret = sodium.crypto_scalarmult(privateKey, nodePubKey);

  return diffieHellmanSecret;
}

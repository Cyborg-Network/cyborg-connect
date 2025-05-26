import sodium from 'libsodium-wrappers'

export type X25519PubKey = Uint8Array
export type X25519PrivKey = Uint8Array

export type X25519KeyPair = {
  publicKey: X25519PubKey
  privateKey: X25519PrivKey
}

export const generateX25519KeyPair = async (): Promise<X25519KeyPair> => {
  await sodium.ready

  return sodium.crypto_kx_keypair()
}

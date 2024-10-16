import sodium from 'libsodium-wrappers'

export const generateX25519KeyPair = async () => {
      await sodium.ready;
      
      return sodium.crypto_kx_keypair();
}

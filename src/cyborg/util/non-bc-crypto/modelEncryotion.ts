import sodium from 'libsodium-wrappers';
import { X25519KeyPair } from './generateX25519KeyPair';

export const deriveSharedSecret = async (
  privateKey: Uint8Array,
  minerPublicKey: Uint8Array
): Promise<Uint8Array> => {
  await sodium.ready;
  return sodium.crypto_scalarmult(privateKey, minerPublicKey);
};

export const encryptModel = async (
  file: File,
  sharedSecret: Uint8Array
): Promise<{ encryptedFile: Blob; nonce: Uint8Array }> => {
  await sodium.ready;
  
  // Read file as ArrayBuffer
  const fileBuffer = await file.arrayBuffer();
  const fileBytes = new Uint8Array(fileBuffer);
  
  // Generate random nonce
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  
  // Encrypt the file
  const encryptedBytes = sodium.crypto_secretbox_easy(
    fileBytes,
    nonce,
    sharedSecret
  );
  
  return {
    encryptedFile: new Blob([encryptedBytes], { type: file.type }),
    nonce
  };
};

export const accountIdToPublicKey = (accountId: string): Uint8Array => {
  // Remove the SS58 prefix (first byte) to get the raw public key
  const decoded = sodium.from_hex(accountId.slice(2)); // Remove '0x' prefix
  return decoded.slice(0, 32); // Take first 32 bytes (public key)
};
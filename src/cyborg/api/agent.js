import { signMessageWithWallet } from "../util/non-bc-crypto/signMessageWithWallet";
import sodium from 'libsodium-wrappers'

export const constructAgentApiRequest = (target_ip, requestType) => {

  console.log(target_ip);
  
  const request = JSON.stringify({
    target_ip: target_ip,
    endpoint: "Request",
    request_type: requestType,
  })

  return request
}

export const constructAgentAuthRequest = async (target_ip, taskId, ephemeral_public_key) => {

  await sodium.ready;
  const { signedTimestamp, signature } = await signMessageWithWallet();

  const request = JSON.stringify({
    target_ip: target_ip,
    endpoint: "Auth",
    task_id: taskId,
    signed_timestamp: signedTimestamp,
    signed_timestamp_signature: signature,
    ephemeral_public_key: sodium.to_hex(ephemeral_public_key),
  })

  return request
}

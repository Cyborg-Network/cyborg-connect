import { signTimestampWithWallet } from "../../util/non-bc-crypto/signTimestampWithWallet";
import sodium from 'libsodium-wrappers'

export const constructAgentApiRequest = (target_ip, requestType) => {

  const request = JSON.stringify({
    target_ip: target_ip,
    endpoint: "Request",
    request_type: requestType,
  })

  return request
}

export const constructAgentAuthRequest = async (target_ip, taskId, ephemeral_public_key) => {

  await sodium.ready;
  const { signedTimestamp, signature } = await signTimestampWithWallet();

  const request = JSON.stringify({
    target_ip: target_ip,
    endpoint: "Auth",
    task_id: 1,
    signed_timestamp: signedTimestamp,
    signed_timestamp_signature: signature,
    ephemeral_public_key: sodium.to_hex(ephemeral_public_key),
  })

  return request
}

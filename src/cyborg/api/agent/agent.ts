import { AgentRequestType, IpAddress } from '../../types/agent'
import { TaskId } from '../../types/task'
import { X25519PubKey } from '../../util/non-bc-crypto/generateX25519KeyPair'
import { signTimestampWithWallet } from '../../util/non-bc-crypto/signTimestampWithWallet'
import sodium from 'libsodium-wrappers'

export const constructAgentApiRequest = (
  target_ip: IpAddress,
  requestType: AgentRequestType
) => {
  const request = JSON.stringify({
    target_ip: target_ip,
    endpoint: 'Request',
    request_type: requestType,
  })

  return request
}

export const constructAgentAuthRequest = async (
  target_ip: IpAddress,
  taskId: TaskId,
  ephemeral_public_key: X25519PubKey
) => {
  await sodium.ready
  const { signedTimestamp, signature } = await signTimestampWithWallet()

  const request = JSON.stringify({
    target_ip: target_ip,
    endpoint: 'Auth',
    task_id: taskId,
    signed_timestamp: signedTimestamp,
    signed_timestamp_signature: signature,
    ephemeral_public_key: sodium.to_hex(ephemeral_public_key),
  })

  return request
}

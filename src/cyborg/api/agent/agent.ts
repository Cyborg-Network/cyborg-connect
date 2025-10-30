import { AgentRequestType, ContainerKeypair, IpAddress } from '../../types/agent'
import { TaskId } from '../../types/task'
import { X25519PubKey } from '../../util/non-bc-crypto/generateX25519KeyPair'
import { signTimestampWithWallet } from '../../util/non-bc-crypto/signTimestampWithWallet'
import sodium from 'libsodium-wrappers'
import { safeBigIntToNumberTransform } from '../../util/numberOperations'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

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
    // This should change once the task id becomes a uuid since it is not exactly prod safe
    task_id: safeBigIntToNumberTransform(taskId),
    signed_timestamp: signedTimestamp,
    signed_timestamp_signature: signature,
    ephemeral_public_key: sodium.to_hex(ephemeral_public_key),
  })

  return request
}

export const downloadSshKeyZip = async (keypair: ContainerKeypair) => {
    if (!keypair) return;
  
    const zip = new JSZip();
    zip.file('id_ed25519', keypair.private_key);
    zip.file('id_ed25519.pub', keypair.public_key);
  
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'ssh-keys.zip');
}

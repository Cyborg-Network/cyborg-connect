import { useState, useRef, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { accountIdToPublicKey, deriveSharedSecret, encryptModel } from '../../util/non-bc-crypto/modelEncryotion'
import { generateX25519KeyPair } from '../../util/non-bc-crypto/generateX25519KeyPair'

const useFileUpload = () => {
  const trackingUrl = `${process.env.REACT_APP_GATEKEEPER_WS_URL}/track_upload`
  const uploadUrl = `${process.env.REACT_APP_GATEKEEPER_HTTPS_URL}/upload`
  const [uploadId, setUploadId] = useState<string | null>(null)
  const [progress, setProgress] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [taskId, setTaskId] = useState<number | null>(null)

  const abortControllerRef = useRef(null)
  const intervalRef = useRef<number | null>(null)
  const wsRef = useRef<ReconnectingWebSocket | null>(null)

  useEffect(() => {
    console.log("EFFECT RUNNING")
    if (!uploadId) return

    const ws = new ReconnectingWebSocket(`${trackingUrl}/${uploadId}`)
    wsRef.current = ws

    ws.onopen = () => {
      intervalRef.current = window.setInterval(() => {
        ws.send('update')
      }, 2000)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data?.taskId) setTaskId(data.taskId)
        if (typeof event.data === 'string') {
          const data = JSON.parse(event.data)
          console.log(data);
          setProgress(data.message)
          console.log(data.taskId)
          if (data.message === 'Model successfully stored! Proceeding with deployment...' && (data.taskId || data.taskId === 0)) {
            console.log(true)
            setIsUploading(false)
            setTaskId(data.taskId)
            if (intervalRef.current) clearInterval(intervalRef.current)
          }
        }
      } catch (err) {
        console.warn("Failed to parse message:", err)
      }
    }

    ws.onerror = (err) => {
      console.error('WebSocket error:', err)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      ws.close()
    }
  }, [uploadId])

  const uploadFile = useCallback(async (formData: FormData, minerAddress: string, minerId: number) => {
    if (!formData) return;

    setProgress('Initiating Upload');
    setIsUploading(true);
    setError(null);

    try {
      // Generate ephemeral key pair
      const keyPair = await generateX25519KeyPair();
      
      // Convert miner's account ID to public key
      const minerPublicKey = accountIdToPublicKey(minerAddress);
      
      // Derive shared secret
      const sharedSecret = await deriveSharedSecret(keyPair.privateKey, minerPublicKey);
      
      // Get files from form data
      const modelFile = formData.get('model.onnx') as File;
      const inputFile = formData.get('publicInput.json') as File;
      
      // Encrypt files
      setProgress('Encrypting model...');
      const { encryptedFile: encryptedModel } = await encryptModel(modelFile, sharedSecret);
      const { encryptedFile: encryptedInput } = await encryptModel(inputFile, sharedSecret);
      
      // Create new form data with encrypted files
      const encryptedFormData = new FormData();
      encryptedFormData.append('model.onnx', encryptedModel, modelFile.name);
      encryptedFormData.append('publicInput.json', encryptedInput, inputFile.name);
      
      // Add ephemeral public key to headers
      const headers = {
        'miner-account': minerAddress,
        'miner-id': String(minerId),
        'ephemeral-pubkey': sodium.to_hex(keyPair.publicKey)
      };

      const response = await fetch(uploadUrl, {
        headers,
        method: 'POST',
        body: encryptedFormData,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      setUploadId(data.upload_id);
      return data.uploadId;
    } catch (err) {
      setError(err);
      setIsUploading(false);
      toast.error("Upload failed, please try again!");
    }
  }, []);


  const cancelUpload = useCallback(() => {
    abortControllerRef.current?.abort()
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    wsRef.current?.close()
  }, [])

  return {
    uploadFile,
    cancelUpload,
    taskId,
    progress,
    isUploading,
    error,
  }
}

export default useFileUpload

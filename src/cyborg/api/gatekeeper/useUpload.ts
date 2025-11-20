import { useState, useRef, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import ReconnectingWebSocket from 'reconnecting-websocket'

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

  const uploadFile = useCallback(async (formData: FormData, minerId: string) => {
    if (!formData) return

    setProgress('Initiating Upload')
    setIsUploading(true)
    setError(null)

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const response = await fetch(uploadUrl, {
        headers: {
          'miner-id': String(minerId)
        },
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })

      if (!response.ok) {
        toast(`Upload failed: ${response.statusText}`)
        console.log('upload error: ', response)
        setIsUploading(false)
        return
      }

      const data = await response.json()
      console.log('upload data: ', data.upload_id)
      setUploadId(data.upload_id)
      return data.uploadId
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Upload canceled')
      } else {
        setError(err.message)
        setIsUploading(false)
        toast("Upload failed, please try again!")
      }
    }
  }, [])

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

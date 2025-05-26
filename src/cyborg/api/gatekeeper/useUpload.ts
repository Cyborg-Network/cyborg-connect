import { useState, useRef, useCallback, useEffect } from 'react'
import useWebSocket from 'react-use-websocket'

export function useFileUpload() {
  const uploadUrl = `${process.env.REACT_APP_GATEKEEPER_HTTPS_URL}/upload`
  const trackingUrl = `${process.env.REACT_APP_GATEKEEPER_WS_URL}/track_upload`
  const [uploadId, setUploadId] = useState<string | null>(null)
  const [progress, setProgress] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    uploadUrl ? `${trackingUrl}/${uploadId}` : null,
    {
      shouldReconnect: () => false,
      retryOnError: false,
    }
  )

  useEffect(() => {
    if (uploadId && readyState === WebSocket.OPEN) {
      // Start interval polling
      intervalRef.current = setInterval(() => {
        sendMessage('update')
      }, 2000)
    }

    return () => {
      // Clean up interval on dismount or uploadId change
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [uploadId, readyState, sendMessage])

  useEffect(() => {
    if (lastMessage?.data) {
      setProgress(lastMessage.data)
    }
  }, [lastMessage])

  const uploadFile = useCallback(async (file: File) => {
    if (!file) return

    setProgress('Initiating Upload')
    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const data = await response.json() // Or whatever response your backend gives

      console.log(data)

      setUploadId(data)
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Upload canceled')
      } else {
        setError(err.message)
      }
      throw err
    } finally {
      setIsUploading(false)
    }
  }, [])

  const cancelUpload = useCallback(() => {
    abortControllerRef.current?.abort()
  }, [])

  return {
    uploadFile,
    cancelUpload,
    progress,
    isUploading,
    error,
  }
}

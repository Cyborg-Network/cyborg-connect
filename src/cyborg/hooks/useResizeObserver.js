import { useState, useEffect, useRef } from 'react'

function useResizeObserver() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const ref = useRef(null)
  const resizeObserverRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    const observeTarget = ref.current
    if (!observeTarget) return

    const updateDimensions = ({ width, height }) => {
      if (isMounted) {
        setDimensions({ width, height })
      }
    }

    resizeObserverRef.current = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const { width, height } = entry.contentRect
        setTimeout(() => updateDimensions({ width, height }), 100)
      })
    })

    resizeObserverRef.current.observe(observeTarget)

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
      isMounted = false
    }
  }, [])

  return { ref, ...dimensions }
}

export default useResizeObserver

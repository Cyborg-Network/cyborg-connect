import { useState, useEffect, useRef, useCallback } from 'react';

function useResizeObserver() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const ref = useRef(null);
  const resizeObserverRef = useRef(null);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const updateDimensions = useCallback(
    debounce((width, height) => {
      setDimensions({ width, height });
    }, 100),
    []
  );

  useEffect(() => {
    const observeTarget = ref.current;
    if (!observeTarget) return;

    resizeObserverRef.current = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const { width, height } = entry.contentRect;
        updateDimensions(width, height);
      });
    });

    resizeObserverRef.current.observe(observeTarget);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [updateDimensions]);

  return { ref, ...dimensions };
}

export default useResizeObserver;

import { useEffect, useRef } from 'react'

export function GetLogs({ link, taskId, scrollIsAutomated, logs }) {

  const scrollRef = useRef(null)

  //Checks if user has locked the scrollbar, and if not resets it down to the current log
  useEffect(() => {
    const setScrollThumb = () => {
      if (scrollIsAutomated) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }

    if (scrollRef.current) {
      setScrollThumb()
    }
  }, [scrollIsAutomated])

   return (
    <code
      ref={scrollRef}
      className="flex justify-between h-full text-opacity-75 text-white bg-cb-gray-700 bg-opacity-25 w-full rounded-md p-2 overflow-y-scroll"
    >
      <div className="flex flex-col">
        <div>{`[16.171.249.42][TaskID: ${taskId}] Logs:`}</div>
        {
          logs ?
          logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))
          : <div>Pending...</div>
        }
      </div>
    </code>
  )
}

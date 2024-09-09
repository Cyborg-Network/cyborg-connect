import axios from 'axios'
import { useState, useEffect } from 'react'

export function GetLogs({ link, taskId }) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState(null)

  // useEffect(()=>{
  //   const stored = sessionStorage.getItem(taskId)
  //   console.log("stored: ", stored)
  //   if (stored) setData(stored)
  // }, [])

  useEffect(() => {
    const fetchData = async (retryCount = 5, interval = 6000) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_HTTP_PREFIX}://${link}/logs/${taskId}`,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
          }
        )
        console.log('logs response: ', response)
        sessionStorage.setItem(`TASKID:${taskId}`, response.data)
        setData(response.data)
      } catch (error) {
        if (retryCount === 0) {
          setData(error)
          console.error('API call failed after 5 retries:', error)
        } else {
          setData(
            'Pending..' + ['.', '.', '.', '.', '.'].slice(retryCount).join(',')
          )
          console.warn(`Retrying... ${retryCount} attempts left.`)
          setTimeout(() => fetchData(retryCount - 1, interval), interval)
        }
      }
    }
    console.log(
      'deploy data: ',
      data,
      `${process.env.REACT_APP_HTTP_PREFIX}://${link}/logs/${taskId}`
    )
    const stored = sessionStorage.getItem(`TASKID:${taskId}`)
    console.log('stored: ', taskId, stored)
    if (stored && stored.length > 0) {
      setData(stored)
    } else if (link && data === null) fetchData()
  }, [taskId, link])

  useEffect(() => {
    const fetchStatusInfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_HTTP_PREFIX}://${link}/deployment-status/${taskId}`,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
          }
        )
        setStatus(response.data)
      } catch (error) {
        console.log('STATUS ERROR:: ', error)
        setStatus('error')
      }
    }

    if (link) fetchStatusInfo()
  }, [taskId, link])

  // console.log("deploy status: ", status)
  console.log('logs data: ', data)
  // console.log("display data: ", display)
  return (
    <code className="flex justify-between h-full text-opacity-75 text-white bg-cb-gray-700 bg-opacity-25 w-full rounded-md p-2">
      <div className="flex flex-col">
        {status && status.conditions && status.conditions.length > 0 ? (
          <div
            className={`${
              status && status.conditions.length > 0 ? '' : 'hidden'
            }`}
          >
            <div>
              {`[${link}][TaskID: ${taskId}] Status: ` +
                status.conditions[0].lastUpdateTime}
            </div>
            <div>
              {`[${link}][TaskID: ${taskId}] Status: ` +
                status.conditions[0].message}
            </div>
            <div>
              {`[${link}][TaskID: ${taskId}] Status: ` +
                status.conditions[0].reason}
            </div>
            <div>
              {`[${link}][TaskID: ${taskId}] Status: ` +
                status.conditions[0].status}
            </div>
            <div>
              {`[${link}][TaskID: ${taskId}] Status: ` +
                status.conditions[0].type}
            </div>
          </div>
        ) : (
          ''
        )}
        <div>{`[${link}][TaskID: ${taskId}] Logs: ${
          data ? data : 'Pending.....'
        }`}</div>
      </div>
    </code>
  )
}

import { toast } from 'react-hot-toast'

export const handleDispatchError = (api, dispatchError) => {
  if (dispatchError.isModule) {
    // for module errors, we have the section indexed, lookup
    const decoded = api.registry.findMetaError(dispatchError.asModule)
    const { docs, name, section } = decoded
    toast.error(`Dispatch Module Error: ${section}.${name}: ${docs.join(' ')}`)
    console.error(
      `Dispatch Module Error: ${section}.${name}: ${docs.join(' ')}`
    )
  } else {
    // Other, CannotLookup, BadOrigin, no extra info
    toast.error(`Dispatch Module Error: ${dispatchError.toString()}`)
    console.error(`Dispatch Module Error: ${dispatchError.toString()}`)
  }
}

export const handleStatusEvents = (api, events) => {
  let hasErrored = false
  let successfulEvents = null

  events
    // find/filter for failed events
    .filter(({ event }) => api.events.system.ExtrinsicFailed.is(event))
    // we know that data for system.ExtrinsicFailed is
    // (DispatchError, DispatchInfo)
    .forEach(
      ({
        event: {
          data: [error, info],
        },
      }) => {
        error = true
        if (error.isModule) {
          // for module errors, we have the section indexed, lookup
          const decoded = api.registry.findMetaError(error.asModule)
          const { docs, method, section } = decoded
          toast.error(`${section}.${method}: ${docs.join(' ')}`)
          console.error(`${section}.${method}: ${docs.join(' ')}`)
        } else {
          // Other, CannotLookup, BadOrigin, no extra info
          toast.error(error.toString())
          console.error(error.toString())
        }
      }
    )

  const successfulEventArray = events.filter(({ event }) =>
    api.events.taskManagement.TaskScheduled.is(event)
  )

  if (successfulEventArray.length > 0) {
    successfulEvents = successfulEventArray
  }

  return { hasErrored, successfulEvents }
}

export const handleTaskSuccess = (successEvents, workerList) => {
  toast.success(`Task Scheduled`)
  const taskEvent = successEvents[0].toJSON().event.data
  console.log('Extrinsic Success: ', taskEvent)

  const [taskExecutor, , taskId] = taskEvent
  const [workerAddress, workerId] = taskExecutor

  const storedListInfo = sessionStorage.getItem('WORKERLIST')
  console.log('storedListInfo found', JSON.parse(storedListInfo))
  const storedList = storedListInfo ? JSON.parse(storedListInfo).workers : null
  const availableList = workerList || storedList
  console.log('workerList after task: ', availableList)
  console.log('storedList found', storedList)
  let updatedWorkerInfo = availableList
    ? availableList.map(worker => {
        if (Number(worker.id) === workerId && worker.owner === workerAddress) {
          return {
            ...worker,
            lastTask: taskId,
          }
        } else {
          console.log('not found')
          return worker
        }
      })
    : null
  return { taskEvent, updatedWorkerInfo }
}

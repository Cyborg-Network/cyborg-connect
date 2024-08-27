import React, { useState } from 'react'
import { Dimmer } from 'semantic-ui-react'
import {
  SERVICES,
  DEPLOY_STATUS,
  useCyborg,
  useCyborgState,
} from '../../../CyborgContext'
import { useSubstrateState } from '../../../../substrate-lib'
import { web3FromSource } from '@polkadot/extension-dapp'
import toast from 'react-hot-toast'

function UploadDockerImgURL({ setService }) {
  const { selectService, setTaskStatus, setTaskMetadata, listWorkers } =
    useCyborg()
  const { workerList } = useCyborgState()
  const { api, currentAccount } = useSubstrateState()
  const [url, setUrl] = useState('')

  const getFromAcct = async () => {
    const {
      address,
      meta: { source, isInjected },
    } = currentAccount

    if (!isInjected) {
      return [currentAccount]
    }

    // currentAccount is injected from polkadot-JS extension, need to return the addr and signer object.
    // ref: https://polkadot.js.org/docs/extension/cookbook#sign-and-send-a-transaction
    const injector = await web3FromSource(source)
    return [address, { signer: injector.signer }]
  }
  const handleUrlChange = e => {
    setUrl(e.target.value)
  }
  const handleSubmit = async event => {
    event.preventDefault()
    selectService(SERVICES.CYBER_DOCK)
    setTaskStatus(DEPLOY_STATUS.PENDING)

    const fromAcct = await getFromAcct()
    const containerTask = api.tx.taskManagement.taskScheduler(url)
    await containerTask
      .signAndSend(...fromAcct, ({ status, events, dispatchError }) => {
        // status would still be set, but in the case of error we can shortcut
        // to just check it (so an error would indicate InBlock or Finalized)
        if (dispatchError) {
          if (dispatchError.isModule) {
            // for module errors, we have the section indexed, lookup
            const decoded = api.registry.findMetaError(dispatchError.asModule)
            const { docs, name, section } = decoded
            toast.error(
              `Dispatch Module Error: ${section}.${name}: ${docs.join(' ')}`
            )
            setTaskStatus(DEPLOY_STATUS.FAILED)
            console.error(
              `Dispatch Module Error: ${section}.${name}: ${docs.join(' ')}`
            )
          } else {
            // Other, CannotLookup, BadOrigin, no extra info
            toast.error(`Dispatch Module Error: ${dispatchError.toString()}`)
            setTaskStatus(DEPLOY_STATUS.FAILED)
            console.error(`Dispatch Module Error: ${dispatchError.toString()}`)
          }
        }
        if (status.isInBlock || status.isFinalized) {
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
                if (error.isModule) {
                  // for module errors, we have the section indexed, lookup
                  const decoded = api.registry.findMetaError(error.asModule)
                  const { docs, method, section } = decoded
                  toast.error(`${section}.${method}: ${docs.join(' ')}`)
                  console.error(`${section}.${method}: ${docs.join(' ')}`)
                  setTaskStatus(DEPLOY_STATUS.FAILED)
                } else {
                  // Other, CannotLookup, BadOrigin, no extra info
                  toast.error(error.toString())
                  console.error(error.toString())
                  setTaskStatus(DEPLOY_STATUS.FAILED)
                }
              }
            )
          const success = events.filter(({ event }) =>
            api.events.taskManagement.TaskScheduled.is(event)
          )
          if (success.length > 0) {
            toast.success(`Task Scheduled`)
            setTaskStatus(DEPLOY_STATUS.READY)
            const taskEvent = success[0].toJSON().event.data
            console.log('Extrinsic Success: ', taskEvent)
            setTaskMetadata(taskEvent)
            const [taskExecutor, , taskId] = taskEvent
            const [workerAddress, workerId] = taskExecutor

            const storedListInfo = sessionStorage.getItem('WORKERLIST')
            console.log('storedListInfo found', JSON.parse(storedListInfo))
            const storedList = storedListInfo
              ? JSON.parse(storedListInfo).workers
              : null
            const availableList = workerList || storedList
            console.log('workerList after task: ', availableList)
            console.log('storedList found', storedList)
            let updatedWorkerInfo = availableList
              ? availableList.map(worker => {
                  if (
                    Number(worker.id) === workerId &&
                    worker.owner === workerAddress
                  ) {
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
            if (updatedWorkerInfo) {
              console.log('update workers after task submit')
              listWorkers(updatedWorkerInfo)
            }
          }
        }
      })
      .catch(error => {
        console.error('Other Errors', error)
        toast.error(error.toString())
        setTaskStatus(DEPLOY_STATUS.FAILED)
      })
  }
  return (
    <Dimmer active>
      <form onSubmit={handleSubmit} className="bg-cb-gray-700 rounded-lg p-20">
        <h5 className="flex">Upload Docker Image</h5>
        <div className="mb-4">
          <label
            htmlFor="url"
            className="flex text-white text-sm font-bold py-4 mb-2"
          >
            Docker image URL
          </label>
          <input
            type="text"
            id="url"
            name="url"
            onChange={handleUrlChange}
            className="focus:border-cb-green text-cb-gray-600 border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className=" flex items-center justify-between">
            <button
              onClick={() => setService(null)}
              className="bg-cb-gray-600 w-full hover:ring-2 ring-cb-gray-500 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
          <div className=" flex items-center justify-between">
            <button
              type="submit"
              className="bg-cb-green w-full hover:ring-2 ring-white  text-black py-2 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </Dimmer>
  )
}

export default UploadDockerImgURL

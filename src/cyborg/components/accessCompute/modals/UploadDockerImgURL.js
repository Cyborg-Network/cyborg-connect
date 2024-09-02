import React, { useState } from 'react'
import {
  SERVICES,
  DEPLOY_STATUS,
  useCyborg,
  useCyborgState,
} from '../../../CyborgContext'
import { useSubstrateState } from '../../../../substrate-lib'
import toast from 'react-hot-toast'
import Modal from '../../general/Modal'
import Button from '../../general/Button'
import { useNavigate } from 'react-router-dom'
import {
  handleDispatchError,
  handleTaskSuccess,
  handleStatusEvents,
} from '../../../util/serviceDeployment'
import { getAccount } from '../../../util/getAccount'

function UploadDockerImgURL({ setService }) {
  const navigate = useNavigate()

  const { selectService, setTaskStatus, setTaskMetadata, listWorkers } =
    useCyborg()

  const { workerList } = useCyborgState()
  const { api, currentAccount } = useSubstrateState()
  const [url, setUrl] = useState('')
  const [onIsInBlockWasCalled, setOnIsInBlockWasCalled] = useState(false);

  const handleUrlChange = e => {
    setUrl(e.target.value)
  }

  const handleSubmit = async event => {
    event.preventDefault()

    toast("fn called")

    selectService(SERVICES.CYBER_DOCK)
    setTaskStatus(DEPLOY_STATUS.PENDING)

    const fromAcct = await getAccount(currentAccount)
    const containerTask = api.tx.taskManagement.taskScheduler(url)
    await containerTask
      .signAndSend(...fromAcct, ({ status, events, dispatchError }) => {
        // status would still be set, but in the case of error we can shortcut
        // to just check it (so an error would indicate InBlock or Finalized)
        if (dispatchError) {
          handleDispatchError(api, dispatchError)
          setTaskStatus(DEPLOY_STATUS.FAILED)
        }

        if (status.isInBlock || status.isFinalized) {
          const { hasErrored, successEvents } = handleStatusEvents(api, events)

          if (hasErrored) {
            setTaskStatus(DEPLOY_STATUS.FAILED)
          } else if (successEvents) {
            const { taskEvent, updatedWorkerInfo } = handleTaskSuccess(
              successEvents,
              workerList
            )
            setTaskMetadata(taskEvent)
            
            if (updatedWorkerInfo) {
              console.log('update workers after task submit')
              listWorkers(updatedWorkerInfo)
            }
            setTaskStatus(DEPLOY_STATUS.READY)

            //There can be scenarios where the status.isInBlock changes mutliple times, we only want to navigate once
            if(status.isInBlock && !onIsInBlockWasCalled){
              setOnIsInBlockWasCalled(true)
              navigate('dashboard')
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
    <Modal onOutsideClick={() => setService(null)}>
      <Button
        variation="cancel"
        onClick={() => setService(null)}
        additionalClasses="absolute top-6 right-6"
      />
      <form onSubmit={handleSubmit}>
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
              onClick={handleSubmit}
              className="bg-cb-green w-full hover:ring-2 ring-white  text-black py-2 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default UploadDockerImgURL

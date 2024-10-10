import React, { useState } from 'react'
import { SERVICES, DEPLOY_STATUS, useCyborg } from '../../../CyborgContext'
import { useSubstrateState } from '../../../../substrate-lib'
import toast from 'react-hot-toast'
import Modal from '../../general/modals/Modal'
import CloseButton from '../../general/buttons/CloseButton'
import { useNavigate } from 'react-router-dom'
import {
  handleDispatchError,
  handleStatusEvents,
} from '../../../util/serviceDeployment'
import { getAccount } from '../../../util/getAccount'
import { ROUTES } from '../../../../index'
import Button from '../../general/buttons/Button'

function UploadDockerImgURL({ setService, onCancel, nodeIds }) {
  const navigate = useNavigate()

  const { selectService, setTaskStatus, setTaskMetadata } = useCyborg()
  const { api, currentAccount } = useSubstrateState()

  const [url, setUrl] = useState('')
  const [onIsInBlockWasCalled, setOnIsInBlockWasCalled] = useState(false)

  const handleUrlChange = e => {
    setUrl(e.target.value)
  }

  const handleSubmit = async event => {
    event.preventDefault()

    toast(`Scheduling task for node ${nodeIds[0].owner} / ${nodeIds[0].id}`)

    const fromAcct = await getAccount(currentAccount)
    if (fromAcct) {
      selectService(SERVICES.CYBER_DOCK)
      const containerTask = api.tx.taskManagement.taskScheduler(
        url /*, nodeId.owner, nodeId.id*/
      )
      await containerTask
        .signAndSend(...fromAcct, ({ status, events, dispatchError }) => {
          setTaskStatus(DEPLOY_STATUS.PENDING)
          // status would still be set, but in the case of error we can shortcut
          // to just check it (so an error would indicate InBlock or Finalized)
          if (dispatchError) {
            handleDispatchError(api, dispatchError)
            setTaskStatus(DEPLOY_STATUS.FAILED)
            setService(null)
          }

          if (status.isInBlock || status.isFinalized) {
            const { hasErrored, successfulEvents } = handleStatusEvents(
              api,
              events
            )

            if (hasErrored) {
              setTaskStatus(DEPLOY_STATUS.FAILED)
              setService(null)
            } else if (successfulEvents) {
              setTaskStatus(DEPLOY_STATUS.READY)
              const taskEvent = successfulEvents[0].toJSON().event.data
              console.log('Extrinsic Success: ', taskEvent)

              const [taskExecutor, , taskId] = taskEvent
              const [workerAddress, workerId] = taskExecutor
              setTaskMetadata(workerAddress, workerId.toString(), taskId)

              //There can be scenarios where the status.isInBlock changes mutliple times, we only want to navigate once
              if (status.isInBlock && !onIsInBlockWasCalled) {
                setOnIsInBlockWasCalled(true)
                toast.success(
                  `Task scheduled for node ${nodeIds[0].owner} / ${nodeIds[0].id}`
                )
                navigate(ROUTES.DASHBOARD)
              }
            }
          }
        })
        .catch(error => {
          console.error('Other Errors', error)
          toast.error(error.toString())
          setTaskStatus(DEPLOY_STATUS.FAILED)
          setService(null)
        })
    }
  }

  return (
    <Modal onOutsideClick={() => onCancel()}>
      <CloseButton
        variation="cancel"
        onClick={() => onCancel()}
        additionalClasses="absolute top-6 right-6"
      />
      <form onSubmit={handleSubmit}>
        <h5 className="flex">Upload Docker Image</h5>
        <div className="mb-4">
          <input
            type="text"
            id="url"
            name="url"
            placeholder="Insert Docker Image URL"
            onChange={handleUrlChange}
            className="focus:border-cb-green text-cb-gray-600 border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className=" flex items-center justify-between">
            <Button
              variation="secondary"
              onClick={() => setService(null)}
              additionalClasses="w-full"
            >
              Close
            </Button>
          </div>
          <div className=" flex items-center justify-between">
            <Button
              variation="primary"
              onClick={handleSubmit}
              additionalClasses="w-full"
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default UploadDockerImgURL

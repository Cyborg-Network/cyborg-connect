import React, { useEffect, useState } from 'react'
import { DEPLOY_STATUS, SERVICES, useCyborg } from '../../../CyborgContext'
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
import useService from '../../../hooks/useService'
import LoadingModal from '../../general/modals/Loading'

function UploadDockerImgURL({ setService, onCancel, nodes }) {
  const navigate = useNavigate()

  const { setTaskStatus, setTaskMetadata, addUserTask } = useCyborg()
  const { api, currentAccount } = useSubstrateState()
  const service = useService()

  const [url, setUrl] = useState('')
  const [computeHoursDeposit, setComputeHoursDeposit] = useState('')
  const [onIsInBlockWasCalled, setOnIsInBlockWasCalled] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [serviceSpecificContent, setServiceSpecificContent] = useState({header: "", placeholder: ""});
  
  const SERVICE_CONTENT = {
    docker: {
      header: "Upload Docker Image",
      placeholder: "Insert Docker Image URL"
    }, 
    executable: {
      header: "Upload Executable File",
      placeholder: "Insert Location of Executable"
    }
  }

  useEffect(() => {
    if(service){
      if(service.id === SERVICES.CYBER_DOCK.id){
        setServiceSpecificContent(SERVICE_CONTENT.docker)
      }
      if(service.id === SERVICES.EXECUTABLE.id){
        setServiceSpecificContent(SERVICE_CONTENT.executable)
      }
    }
  }, [])

  useEffect(() => {
    console.log(nodes);
  }, [nodes])

  const handleUrlChange = e => {
    setUrl(e.target.value)
  }

  const handleComputeHourDepositChange = e => {
    setComputeHoursDeposit(e.target.value)
  }

  const navigateToDashboard = () => {
    if(service.id === 'CYBER_DOCK'){
      navigate(ROUTES.CYBERDOCK_DASHBOARD);
    }
    if(service.id === 'EXECUTABLE'){
      navigate(ROUTES.EXECUTABLE_DASHBOARD);
    }
  }

    const handleSubmit = async () => {
    //event.preventDefault()
    const parsedHoursDeposit = parseInt(computeHoursDeposit);
    if(isNaN(parsedHoursDeposit)) {
      toast("Please input a valid number of compute hours!")
      return
    }

    setIsLoading(true);

    toast(`Scheduling task...`)

    console.log(url, nodes[0].owner, nodes[0].id, 1);

    const fromAcct = await getAccount(currentAccount)
    if (fromAcct) {
      const task = api.tx.taskManagement.taskScheduler(
        service.substrateEnumValue,
        url,
        undefined,
        nodes[0].owner,
        nodes[0].id,
        parsedHoursDeposit
      )
      
      await task
        .signAndSend(...fromAcct, ({ status, events, dispatchError }) => {
          //setTaskStatus(DEPLOY_STATUS.PENDING)
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
            } else if (successfulEvents) {
              //setTaskStatus(DEPLOY_STATUS.READY)
              const taskEvent = successfulEvents[0].toJSON().event.data
              console.log('Extrinsic Success: ', taskEvent)

              const [taskExecutor, , taskId] = taskEvent
              const [workerAddress, workerId] = taskExecutor
              setTaskMetadata(workerAddress, workerId.toString(), taskId)
              addUserTask(taskId)

              //There can be scenarios where the status.isInBlock changes mutliple times, we only want to navigate once
              if (status.isInBlock && !onIsInBlockWasCalled) {
                setOnIsInBlockWasCalled(true)
                setIsLoading(false)
                navigateToDashboard()
                //toast.success(
                //  `Task executing in node ${nodeIds[0].owner} / ${nodeIds[0].id}`
                //)
                //navigateToDashboard()
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
  }

  return (
    <>
    {
    isLoading
    ? <LoadingModal text={"Processing Compute Request, Please Wait..."} />
    :
    <Modal onOutsideClick={() => onCancel()}>
      <CloseButton
        variation="cancel"
        onClick={() => onCancel()}
        additionalClasses="absolute top-6 right-6"
      />
      <div>
        <h5 className="flex">{serviceSpecificContent.header}</h5>
        <div className="mb-4">
          <input
            type="text"
            id="url"
            name="url"
            placeholder={serviceSpecificContent.placeholder}
            onChange={e => handleUrlChange(e)}
            className="focus:border-cb-green text-cb-gray-600 border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <h5 className="flex">Deposit Compute Hours</h5>
        <div className="mb-4">
          <input
            type="text"
            id="url"
            name="url"
            placeholder="Insert Number of Compute Hours"
            onChange={e => handleComputeHourDepositChange(e)}
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
              onClick={() => handleSubmit()}
              additionalClasses="w-full"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </Modal>
    }
    </>
  )
}

export default UploadDockerImgURL

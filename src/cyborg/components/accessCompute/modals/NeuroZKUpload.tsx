import React, { useEffect, useState } from 'react'
import { DEPLOY_STATUS, useCyborg } from '../../../CyborgContext'
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
import { IoMdInformationCircleOutline } from "react-icons/io";
import axios from 'axios'
import LoadingModal from '../../general/modals/Loading'
import { ReactComponent as ZkPublicInputs } from '../../../../../public/assets/icons/zk_public_inputs.svg'

interface Props {
  setService: (service: string | null) => void,
  onCancel: () => void,
  nodes: any,
}

//TODO: This file will become relevant again when the new AI/ZK miners roll out, at this point it should be adjusted to work in a similar way to SimpleTaskUpload.js
const NeuroZkUpload: React.FC<Props> = ({ setService, onCancel, nodes }: Props) => {
  const navigate = useNavigate()

  const { /*selectService, */setTaskStatus, setTaskMetadata, addUserTask } = useCyborg()
  const { api, currentAccount } = useSubstrateState()
  const service = useService()
  const [zkFiles, setZkFiles] = useState({
    zk_public_input: null,
    zk_circuit: null,
  })
  const [isLoading, setIsLoading] = useState(false);

  const [url, setUrl] = useState('')
  const [onIsInBlockWasCalled, setOnIsInBlockWasCalled] = useState(false)

  const handleUrlChange = e => {
   setUrl(e.target.value)
  }

  const uploadFiles = async () => {
    

    const formData = new FormData();

    formData.append("zk_public_input.json", zkFiles.zk_public_input);
    formData.append("zk_circuit.circom", zkFiles.zk_circuit);

    try {
      const response = await axios.post('https://www.server.cyborgnetwork.io:8081/upload', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })

      const data = response.data;
      console.log(data)
      return response
    } catch (error) {
      console.log("Error uploading the zk files", error)
    }
  }

  const navigateToDashboard = () => {
    if(service.id === 'CYBER_DOCK'){
      navigate(ROUTES.CYBERDOCK_DASHBOARD);
    }
    if(service.id === 'NEURO_ZK'){
      navigate(ROUTES.EXECUTABLE_DASHBOARD);
    }
  }

    const handleSubmit = async (zkCid) => {
    //event.preventDefault()

    toast(`Scheduling task...`)

    console.log(url, zkCid, nodes[0].owner, nodes[0].id, 1);

    const fromAcct = await getAccount(currentAccount)
    if (fromAcct) {
              //'hello-world' , nodeId.owner, nodeIds[0].
      const ipfsTask = api.tx.taskManagement.taskScheduler(
        url,
        zkCid,
        nodes[0].owner,
        nodes[0].id,
        1
      )
      
      await ipfsTask
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



  const handleTaskExecution = async () => {
    if(!zkFiles.zk_public_input){
      toast("Please provide both files for zk proof generation!")
      return
    }

    setIsLoading(true);
    setTaskStatus(DEPLOY_STATUS.PENDING)
    const response = await uploadFiles();
    const data = response.data
    console.log(data)
    console.log(zkFiles);

    handleSubmit(data);
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    console.log(e.target)
    setZkFiles((prevState) => ({
      ...prevState,
      [name]: files[0],
    }));
  }

  useEffect(() => {
    console.log(zkFiles)
  }, [zkFiles])

  const FileUploadElement = ({name, infoText, icon, label}) => {

    const [infoTextDisplayed, setInfoTextDisplayed] = useState(false);

    const InfoTextContainer = ({infoText}) => {
      return(
        <div className='absolute min-w-80 top-full left-full rounded-lg border border-cb-gray-400 bg-black bg-opacity-90 p-4 z-50 text-white'>
          {infoText}
        </div>
      )
    }

    return (
      <div className='relative aspect-square grid justify-center items-center border border-gray-500 rounded-lg'>
        <label
          htmlFor={`fileInput-${name}`}
          className={`flex flex-col items-center justify-center w-32 h-32 rounded-lg cursor-pointer transition-colors
          ${zkFiles[name] ? 'border-green-500 bg-cb-gray-500' : 'border-gray-500 bg-cb-gray-700'}
          hover:border-blue-500`}
        >
          <div className='bg-cb-gray-400 rounded-full p-3 aspect-square grid justify-center items-center'>
            {icon}
          </div>
          <div>{label}</div> 
        </label>
        <div 
          onMouseEnter={() => setInfoTextDisplayed(true)}
          onMouseLeave={() => setInfoTextDisplayed(false)}
          className='absolute top-2 right-2 text-gray-500'>
          <IoMdInformationCircleOutline size={18}/>
          {infoTextDisplayed
            ? <InfoTextContainer infoText={infoText}/>
            : <></>
          }
        </div>
        <input
          id={`fileInput-${name}`}
          type="file"
          name={name}
          onChange={(e) => handleFileChange(e)}
          className='hidden'
        />
      </div>
    )
  }

  return (
    <>
    {
    isLoading
    ? <LoadingModal text={"Processing Compute Request, Please Wait..."} />
    :
    <Modal onOutsideClick={() => onCancel()}>
      <CloseButton
        type='button'
        onClick={() => onCancel()}
        additionalClasses="absolute top-6 right-6"
      />
      <div>
        <h5 className="flex">Enter Executable IPFS CID</h5>
        <div className="mb-4">
          <input
            type="text"
            id="url"
            name="url"
            placeholder="IPFS CID..."
            onChange={e => handleUrlChange(e)}
            className="flex-grow bg-cb-gray-700 text-white border border-gray-500 focus:border-cb-green focus:bg-cb-gray-500 focus:outline-none py-2 px-3 w-full rounded"
          />
        </div>
        <h5 className='flex mb-6'>Upload ZK Files</h5>
        <div className='flex gap-4 justify-evenly mb-6'>
          <FileUploadElement label="Public Input" icon={<ZkPublicInputs />} name='zk_public_input' infoText='A public input file, required for the generation of a zero knowledge proof.' />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className=" flex items-center justify-between">
            <Button
              type='button'
              selectable={false}
              variation="secondary"
              onClick={() => onCancel()}
              additionalClasses="w-full"
            >
              Close
            </Button>
          </div>
          <div className=" flex items-center justify-between">
            <Button
              type='button'
              selectable={false}
              variation="primary"
              onClick={() => handleTaskExecution()}
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

export default NeuroZkUpload

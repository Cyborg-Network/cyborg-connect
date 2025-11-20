import React, { useEffect, useState } from 'react'
import { useCyborg } from '../../../CyborgContext'
import toast from 'react-hot-toast'
import Modal from '../../general/modals/Modal'
import CloseButton from '../../general/buttons/CloseButton'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../../index'
import Button from '../../general/buttons/Button'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import LoadingModal from '../../general/modals/Loading'
import { ReactComponent as ZkPublicInputs } from '../../../../../public/assets/icons/zk_public_inputs.svg'
import useFileUpload from '../../../api/gatekeeper/useUpload'
import useService from '../../../hooks/useService'

interface Props {
  onCancel: () => void
  minerId: string
}

const NeuroZkUpload: React.FC<Props> = ({
  onCancel,
  minerId,
}: Props) => {
  console.log('minerId: ', minerId)
  const navigate = useNavigate()

  const { setService } = useService()

  const { addUserTask } = useCyborg()
  const [zkFiles, setZkFiles] = useState({
    model: null,
    publicInput: null
  })
  const { 
    uploadFile, 
    cancelUpload, 
    isUploading, 
    progress, 
    error,
    taskId
  } = useFileUpload();

  const navigateToDashboard = () => {
    navigate(ROUTES.DASHBOARD)
  }

  useEffect(() => {
    console.log(zkFiles)
  }, [zkFiles])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])
  
  useEffect(() => {
    if(!isUploading && taskId) {
      setService(null)
      addUserTask(taskId)
      navigateToDashboard() 
    }
  }, [isUploading, taskId])

  const uploadModel = async () => {
    if (!zkFiles.model || !zkFiles.publicInput) {
      toast('Please upload both model and public input files!')
      return
    }

    const formData = new FormData()

    formData.append('model.onnx', zkFiles.model)
    formData.append('publicInput.json', zkFiles.publicInput)

    uploadFile(formData, minerId);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    console.log(e.target)
    setZkFiles(prevState => ({
      ...prevState,
      [e.target.name]: files[0],
    }))
  }

  useEffect(() => {
    console.log(zkFiles)
  }, [zkFiles])

  const FileUploadElement = ({ name, infoText, icon, label }) => {
    const [infoTextDisplayed, setInfoTextDisplayed] = useState(false)

    const InfoTextContainer = ({ infoText }) => {
      return (
        <div className="absolute min-w-80 top-full left-full rounded-lg border border-cb-green-500 bg-black bg-opacity-90 p-4 z-50 text-white">
          {infoText}
        </div>
      )
    }

    return (
      <div className="relative aspect-square grid justify-center items-center border border-gray-500 rounded-lg">
        <label
          htmlFor={`fileInput-${name}`}
          className={`flex flex-col items-center justify-center w-32 h-32 rounded-lg cursor-pointer transition-colors
          ${
            zkFiles[name]
              ? 'border-green-500 bg-cb-gray-500'
              : 'border-gray-500 bg-cb-gray-700'
          }
          hover:border-blue-500`}
        >
          <div className="bg-cb-gray-400 rounded-full p-3 aspect-square grid justify-center items-center">
            {icon}
          </div>
          <div>{label}</div>
        </label>
        <div
          onMouseEnter={() => setInfoTextDisplayed(true)}
          onMouseLeave={() => setInfoTextDisplayed(false)}
          className="absolute top-2 right-2 text-gray-500"
        >
          <IoMdInformationCircleOutline size={18} />
          {infoTextDisplayed ? (
            <InfoTextContainer infoText={infoText} />
          ) : (
            <></>
          )}
        </div>
        <input
          id={`fileInput-${name}`}
          type="file"
          name={name}
          onChange={e => handleFileChange(e)}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <>
      {isUploading ? (
        <LoadingModal 
          text={progress ? `Uploading: ${progress}` : `Uploading...`} 
          onClose={() => {
            cancelUpload()
            onCancel()
          }}
        />
      ) : (
        <Modal onOutsideClick={() => onCancel()}>
          <CloseButton
            type="button"
            onClick={() => onCancel()}
            additionalClasses="absolute top-6 right-6"
          />
          <div>
            <h5 className="flex">Upload Model For ZK Inference</h5>
            <h5 className="flex mb-6">Select .ONNX Model</h5>
            <div className="flex gap-4 justify-evenly mb-6">
              <FileUploadElement
                label="Model"
                icon={<ZkPublicInputs />}
                name="model"
                infoText="A tract compatible model in the .ONNX format."
              />
              <FileUploadElement
                label="Public Input"
                icon={<ZkPublicInputs />}
                name="publicInput"
                infoText="A public input in a format that the model can consume, used for the generation of the zk-proofs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className=" flex items-center justify-between">
                <Button
                  type="button"
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
                  type="button"
                  selectable={false}
                  variation="primary"
                  onClick={() => uploadModel()}
                  additionalClasses="w-full"
                >
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default NeuroZkUpload

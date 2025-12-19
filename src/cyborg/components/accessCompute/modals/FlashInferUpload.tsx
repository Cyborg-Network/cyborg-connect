import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '../../general/modals/Modal'
import CloseButton from '../../general/buttons/CloseButton'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../../index'
import Button from '../../general/buttons/Button'
import useTransaction from '../../../api/parachain/useTransaction'
import { useParachain } from '../../../context/PapiContext'
import { Binary, Enum } from 'polkadot-api'
import { MinerReactRouterState } from '../../../types/miner'
//import useService from '../../../hooks/useService'

interface Props {
  setService: (service: string | null) => void
  onCancel: () => void
  nodes: MinerReactRouterState[]
}

const FlashInferUpload: React.FC<Props> = ({
  setService,
  onCancel,
  nodes,
}: Props) => {
  const navigate = useNavigate()

  const { account } = useParachain();
  const { parachainApi } = useParachain();
  //const { service } = useService()

  const [huggingfaceId, setHuggingfaceId] = useState('')
  const [computeHoursDeposit, setComputeHoursDeposit] = useState('')

  const handleUrlChange = e => {
    setHuggingfaceId(e.target.value)
  }

  const handleComputeHourDepositChange = e => {
    setComputeHoursDeposit(e.target.value)
  }

  const navigateToDashboard = () => {
    navigate(ROUTES.DASHBOARD)
  }

  const { handleTransaction } = useTransaction()

  const submitTransaction = async parsedHoursDeposit => {
    const tx = parachainApi.tx.TaskManagement.task_scheduler({
      task_kind: Enum("FlashInfer", {type: "Huggingface", value: Binary.fromText(huggingfaceId)}),
      miner_id: Binary.fromText(nodes[0].id),
      compute_hours_deposit: parsedHoursDeposit
    });

    handleTransaction({
      tx, 
      account, 
      userCallToAction: {
        fn: navigateToDashboard,
        text: "Navigate To Dashboard"
      },
      onSuccessFn: navigateToDashboard,
      txName: "Flash Infer Task"
    });
  }

  const handleSubmit = async () => {
    const parsedHoursDeposit = parseInt(computeHoursDeposit)
    if (isNaN(parsedHoursDeposit)) {
      toast('Please input a valid number of compute hours!')
      return
    }

    submitTransaction(parsedHoursDeposit)
  }

  return (
    <Modal onOutsideClick={() => onCancel()}>
      <CloseButton
        type="button"
        onClick={() => onCancel()}
        additionalClasses="absolute top-6 right-6"
      />
      <div>
        <h5 className="flex">{'Deploy Huggingface Model'}</h5>
        <div className="mb-4">
          <input
            type="text"
            id="url"
            name="url"
            placeholder={'Insert Huggingface Id'}
            onChange={e => handleUrlChange(e)}
            className="focus:border-color-foreground text-color-background-2 border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
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
            className="focus:border-color-foreground text-color-background-2 border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className=" flex items-center justify-between">
            <Button
              type="button"
              selectable={false}
              variation="secondary"
              onClick={() => setService(null)}
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
              onClick={() => handleSubmit()}
              additionalClasses="w-full"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default FlashInferUpload

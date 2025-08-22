import React, { useState } from 'react'
import { useSubstrateState } from '../../../../substrate-lib'
import toast from 'react-hot-toast'
import Modal from '../../general/modals/Modal'
import CloseButton from '../../general/buttons/CloseButton'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../../index'
import Button from '../../general/buttons/Button'
import LoadingModal from '../../general/modals/Loading'
import useTransaction from '../../../api/parachain/useTransaction'
//import useService from '../../../hooks/useService'

interface Props {
  setService: (service: string | null) => void
  onCancel: () => void
  nodes: any
}

const FlashInferUpload: React.FC<Props> = ({
  setService,
  onCancel,
  nodes,
}: Props) => {
  const navigate = useNavigate()

  const { api, currentAccount } = useSubstrateState()
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

  const { handleTransaction, isLoading } = useTransaction(api)

  const submitTransaction = async parsedHoursDeposit => {
    const tx = api.tx.taskManagement.taskScheduler(
      { FlashInfer: { Huggingface: { hf_identifier: huggingfaceId } } },
      nodes[0].owner,
      nodes[0].id,
      parsedHoursDeposit
    )

    await handleTransaction({
      tx,
      account: currentAccount,
      onSuccess: events => {
        console.log('Transaction Successful!', events)
        navigateToDashboard()
      },
      onError: error => toast('Transaction Failed:', error),
    })
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
    <>
      {isLoading ? (
        <LoadingModal text={'Processing Compute Request, Please Wait...'} />
      ) : (
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
      )}
    </>
  )
}

export default FlashInferUpload

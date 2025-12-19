import React from 'react'

import Modal from '../../general/modals/Modal'
import CloseButton from '../../general/buttons/CloseButton'

import Button from '../../general/buttons/Button'

import { useToast } from '../../../context/ToastContext'
import { AiOutlineDownload } from 'react-icons/ai'

interface Props {
  task_id: string,
  onCancel: () => void,
  depositContainerKey: (pubKey: string, task_id: string) => void
  createContainerKeypair: (task_id: string) => void
}

const ManageKeypairs: React.FC<Props> = ({
  task_id,
  onCancel,
  depositContainerKey,
  createContainerKeypair,
}: Props) => {
  const { showToast } = useToast()

  const [pubKey, setPubKey] = React.useState<string | null>(null)

  const retrieveKeypair = () => {
    showToast({type: "general", title: "Action Taken", text: "Getting Keypair..."})
    createContainerKeypair(task_id)
  }

  const depositPubkey = (pubKey: string) => {
    showToast({type: "general", title: "Action Taken", text: "Depositing Key..."})
    depositContainerKey(pubKey, task_id)
  }

  return (
    <Modal onOutsideClick={() => onCancel()}>
      <CloseButton
        type="button"
        onClick={() => onCancel()}
        additionalClasses="absolute top-6 right-6"
      />
      <div className='flex flex-col gap-4 text-color-text-1'>
        <h2>Manage CyCloud Keys</h2>
        <Button
          type="button"
          variation="primary"
          selectable={false}
          onClick={ () => { retrieveKeypair() } }
        >
          <div className='flex gap-2 justify-center'>
            <div>Create Keypair</div>
            <AiOutlineDownload />
          </div>
        </Button>
        <div className='flex gap-4 w-full'>
          <input className='p-3 rounded-md w-full border border-color-text-1' type="text" placeholder="Deposit Public Key" onChange={(e) => { setPubKey(e.target.value) }} />
          <Button
              type="button"
              variation="primary"
              selectable={false}
              onClick={ () => { depositPubkey(pubKey) } }
          >
            <div className='flex gap-2'>
              <div>Confirm</div>
            </div>
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ManageKeypairs


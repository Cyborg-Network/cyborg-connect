import { FaCheck } from 'react-icons/fa6'
import Modal from '../../general/modals/Modal'
import React from 'react'

const SuccessfulDeployModal: React.FC = () => {
  return (
    <Modal onOutsideClick={() => {}}>
      <div className="grid justify-center items-center rounded-full w-32 aspect-square bg-color-background-2">
        <div className="grid justify-center items-center rounded-full w-24 aspect-square bg-color-background-4 text-color-foreground">
          <FaCheck size={50} />
        </div>
      </div>
      <div className="text-color-foreground text-4xl">Success!</div>
      <div className="text-3xl">Your master node is connected.</div>
    </Modal>
  )
}

export default SuccessfulDeployModal

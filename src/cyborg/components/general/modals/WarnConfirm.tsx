import React from 'react'
import Modal from './Modal'
import Button from '../buttons/Button'
import dockdeploy from '../../../../../public/assets/icons/dockdeploy.gif'

function WarnConfirmModal({ text, onClick, onCancel, isLoading }) {


  return (
    <Modal onOutsideClick={() => onCancel()}>
      <div className="flex flex-col text-center items-center justify-center gap-6 max-w-1/3 rounded-lg">
        {isLoading
          ?
          <img className="h-full aspect-square" src={dockdeploy} />
          :
          <p className="text-lg text-color-text-1">{text}</p>
        }
        <div className='flex gap-3'>
          <Button
            type="button"
            variation="warning"
            onClick={onClick}
            selectable={false}
          >
            Confirm
          </Button>
          <Button
            type="button"
            variation="secondary"
            onClick={onCancel}
            selectable={false}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default WarnConfirmModal

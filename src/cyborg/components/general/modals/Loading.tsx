import React from 'react'
import dockdeploy from '../../../../../public/assets/icons/dockdeploy.gif'
import Modal from './Modal'
import CloseButton from '../buttons/CloseButton'

interface Props {
  text: string
  onClose?: () => void
}

const LoadingModal: React.FC<Props> = ({ text, onClose }: Props) => {
  return (
    //Modal doesn't have an outside click function, user has to wait until container is deployed
    <Modal onOutsideClick={() => {}}>
      {
      onClose?
      <CloseButton type="button" additionalClasses="absolute top-6 right-6" onClick={onClose} />
      :
      <></>
      }
      <div className="flex flex-col text-center items-center justify-center gap-6 max-w-1/3 rounded-lg">
        <a className="relative flex">
          <img height={75} width={75} src={dockdeploy} />
        </a>
        <p>{text}</p>
      </div>
    </Modal>
  )
}

export default LoadingModal

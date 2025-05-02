import React from "react"
import Button from "../../general/buttons/Button"
import CloseButton from "../../general/buttons/CloseButton"
import Modal from "../../general/modals/Modal"
import { Separator } from "../../general/Separator"

interface Props {
  onCancel: () => void,
  onProceed: () => void,
}

const FirstNodeDeployModal: React.FC<Props> = ({onCancel, onProceed}: Props) => {

    const handleProceed = () => {
       localStorage.setItem('cyborgConnectDeployIntroductionShown', 'true');

      onProceed();
    }

    return(
        <Modal 
          onOutsideClick={onCancel} 
          additionalClasses='flex flex-col gap-6 items-center text-center'
        >
          <CloseButton 
            type="button"
            additionalClasses='absolute top-6 right-6' 
            onClick={onCancel}
          />
          <div className="text-2xl font-bold">Instructions</div>
          <Separator colorClass='bg-cb-gray-500'/>
          <div className="text-lg">To deploy your first node you'll need to install some software on the machine that is supposed to act as the node. The following screens will guide you through the process of deploying your first node.</div>
          <Separator colorClass='bg-cb-gray-500'/>
          <Button 
            type="button"
            selectable={false}
            variation='primary' 
            onClick={handleProceed}
          >
            Proceed
          </Button>
        </Modal>
    )
}

export default FirstNodeDeployModal

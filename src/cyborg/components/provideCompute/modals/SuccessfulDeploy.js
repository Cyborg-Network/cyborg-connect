import { FaCheck } from "react-icons/fa6"
import Modal from "../../general/modals/Modal"

function SuccessfulDeployModal() {

    return(
        <Modal alignment={'items-center'}>
            <div className='grid justify-center items-center rounded-full w-32 aspect-square bg-cb-gray-600'>
                <div className='grid justify-center items-center rounded-full w-24 aspect-square bg-cb-gray-400 text-cb-green'>
                    <FaCheck size={50}/>
                </div>
            </div>
            <div className='text-cb-green text-4xl'>Success!</div>
            <div className='text-3xl'>Your master node is connected.</div>
        </Modal>
    )
}

export default SuccessfulDeployModal

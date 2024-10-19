import React from 'react'
import Modal from './Modal'
import { MdOutlineLockPerson } from "react-icons/md";
import Button from '../buttons/Button';

function SigntoUnlockModal({text, onClick}) {
  return (
    //Modal doesn't have an outside click function, user has to wait until container is deployed
    <Modal alignment={undefined}>
      <div className="flex flex-col text-center items-center justify-center gap-6 max-w-1/3 rounded-lg">
        <div className='text-cb-green h-40'>
          <MdOutlineLockPerson size={'100%'}/>
        </div>
        <p className='text-lg'>{text}</p>
        <Button variation='primary' onClick={onClick}>
          Sign to Unlock 
        </Button>
      </div>
    </Modal>
  )
}

export default SigntoUnlockModal

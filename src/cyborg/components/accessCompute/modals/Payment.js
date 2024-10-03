import React, { useState } from 'react'
import CloseButton from '../../general/buttons/CloseButton'
import { Separator } from '../../general/Separator'
import Modal from '../../general/Modal'
import borg from '../../../../../public/assets/icons/dockdeploy.png';
import crypto from '../../../../../public/assets/icons/crypto.svg';
import fiat from '../../../../../public/assets/icons/fiat-currencty.svg';
import Button from '../../general/buttons/Button';
import { TiArrowRight } from "react-icons/ti";
import { toast } from 'react-hot-toast';

const PAYMENT_OPTIONS = [
  {name: 'BORGs', icon: borg, isAvailable: true},
  {name: 'Crypto', icon: crypto, isAvailable: false},
  {name: 'FIAT', icon: fiat, isAvailable: false},
]

function PaymentModal() {
  // Modal will be integrated as soon as the rest of the infrastructure has caught up
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [termsAreAccepted, setTermsAreAccepted] = useState(false);

  const startTransaction = () => {
    if(!termsAreAccepted){
      toast("Please accept CyborgNetwork's Terms and Conditions!");
      return;
    }

    if(!selectedOption){
      toast("Please select a payment option!")
      return;
    }

    toast("Mock transaction init.")
  }

  return (
    <Modal additionalClasses={'p-8 2xl:w-3/6 xl:w-3/5 lg:w-4/5 sm:w-4/5 w-11/12 md:p-16'} alignment={undefined}>
      <div className="flex flex-col gap-6 w-full h-full rounded-lg text-lg">
        <div className='flex justify-between'>
          <div className='text-2xl font-bold'>Payment Method</div>
          <CloseButton additionalClasses={'absolute top-6 right-6'}/>
        </div>
        <Separator colorClass={'bg-cb-gray-400'}/>
        <div className='flex flex-col md:flex-row gap-4 justify-center h-full'>
          {
          PAYMENT_OPTIONS.map(option => (
            <Button key={option.name} variation={option.isAvailable ? 'secondary' : 'inactive'} selectable isSelected={selectedOption === option.name} onClick={() => {if(option.isAvailable) setSelectedOption(option.name)}}>
              <div className='flex justify-start items-center gap-2'>
                <img className='h-8 aspect-square' src={option.icon}/>
                <div>{option.name}</div>
                {!option.isAvailable ? <div className='rounded-full bg-cb-gray-400 text-xs px-2 py-1'>COMING SOON</div> : <></>} 
              </div>
            </Button>
            ))
          }
        </div>
        <Separator colorClass={'bg-cb-gray-400'}/>
        <div className='text-xl font-bold'>Fixed Pricing</div>
        <div className='flex justify-between'>
          <div>Subtotal:</div>
          <div className='text-right'>$835.00 USD / month</div>
        </div>
        <Separator colorClass={'bg-cb-gray-400'}/>
        <div className='flex justify-between text-xl font-bold'>
          <div>Total:</div>
          <div>$825.00 USD</div>
        </div>
        <div className='flex gap-4 items-center'>
          <input type='checkbox' onChange={() => setTermsAreAccepted(!termsAreAccepted)}/>
          <div>I agree to CyborgNetwork's <a className='hover:cursor-pointer'>Terms of Service and Conditions</a></div>
        </div>
        <div className='flex flex-col-reverse justify-center gap-4'>
          <Button variation='secondary' additionalClasses='w-full'>
            Cancel
          </Button>
          <Button variation='primary' additionalClasses='w-full' onClick={startTransaction}>
            <div className='flex gap-2 justify-center'>
              <div>Send Transaction</div>
              <TiArrowRight/>
            </div>
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default PaymentModal

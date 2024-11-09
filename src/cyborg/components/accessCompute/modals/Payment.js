import React, { useState } from 'react'
import CloseButton from '../../general/buttons/CloseButton'
import { Separator } from '../../general/Separator'
import Modal from '../../general/modals/Modal'
//import borg from '../../../../../public/assets/icons/dockdeploy.png'
import crypto from '../../../../../public/assets/icons/crypto.svg'
import fiat from '../../../../../public/assets/icons/fiat-currencty.svg'
import Button from '../../general/buttons/Button'
import { TiArrowRight } from 'react-icons/ti'
import { toast } from 'react-hot-toast'
import {
  handleDispatchError,
  handleStatusEvents,
} from '../../../util/serviceDeployment'
import { getAccount } from '../../../util/getAccount'
import { useSubstrateState } from '../../../../substrate-lib'
import robo from '../../../../../public/assets/icons/robo.png'
import LoadingModal from '../../general/modals/Loading'
//import { useNavigate } from 'react-router-dom'
//import { ROUTES } from '../../../../index'
//import useService from '../../../hooks/useService'

const PAYMENT_OPTIONS = [
  { name: 'ENTT', icon: robo, isAvailable: true, testnet: true },
  { name: 'Crypto', icon: crypto, isAvailable: false, testnet: false },
  { name: '', icon: fiat, isAvailable: false, testnet: false },
]

const HOURLY_RATE = 10;

function PaymentModal({ onCancel, onConfirm, setService, hoursSelected}) {
  // from updoad docker modal
   //const navigate = useNavigate()

  const { api, currentAccount } = useSubstrateState()
  //const service = useService()

  //const [url, setUrl] = useState('')
  const [onIsInBlockWasCalled, setOnIsInBlockWasCalled] = useState(false)

  //const handleUrlChange = e => {
  //  setUrl(e.target.value)
  //}

  //const navigateToDashboard = () => {
  //  if(service.id === 'CYBER_DOCK'){
  //    navigate(ROUTES.CYBERDOCK_DASHBOARD);
  //  }
  // if(service.id === 'NEURO_ZK'){
  //   navigate(ROUTES.NEURO_ZK_DASHBOARD);
  //  }
  //}
  // from upload docker modal

  const [selectedOption, setSelectedOption] = useState(PAYMENT_OPTIONS[0].name)
  const [termsAreAccepted, setTermsAreAccepted] = useState(false)
  const [loading, setLoading] = useState(false);

  const startTransaction = () => {
    if (!termsAreAccepted) {
      toast("Please accept CyborgNetwork's Terms and Conditions!")
      return
    }

    if (!selectedOption) {
      toast('Please select a payment option!')
      return
    }

    //onConfirm()
    handleSubmit()
  }

  const handleSubmit = async event => {
    //event.preventDefault()

    //toast(`Scheduling task for node ${nodeIds[0].owner} / ${nodeIds[0].id}`)

    const fromAcct = await getAccount(currentAccount)
    if (fromAcct) {
      const paymentTask = api.tx.payment.purchaseComputeHours(
        hoursSelected
      )
      
      await paymentTask
        .signAndSend(...fromAcct, ({ status, events, dispatchError }) => {
          setLoading(true);
          //setTaskStatus(DEPLOY_STATUS.PENDING)
          // status would still be set, but in the case of error we can shortcut
          // to just check it (so an error would indicate InBlock or Finalized)
          if (dispatchError) {
            handleDispatchError(api, dispatchError)
            toast("Payment failed...")
          }

          if (status.isInBlock || status.isFinalized) {
            const { hasErrored, successfulEvents } = handleStatusEvents(
              api,
              events
            )

            setLoading(false)
            onConfirm()

            if (hasErrored) {
              toast("Payment failed...")
            } else if (successfulEvents) {
              //setTaskStatus(DEPLOY_STATUS.READY)
              const paymentEvent = successfulEvents[0].toJSON().event.data
              console.log('Extrinsic Success: ', paymentEvent)


              //There can be scenarios where the status.isInBlock changes mutliple times, we only want to navigate once
              if (status.isInBlock && !onIsInBlockWasCalled) {
                setOnIsInBlockWasCalled(true)

                //toast.success(
                //  `Task executing in node ${nodeIds[0].owner} / ${nodeIds[0].id}`
                //)
                //navigateToDashboard()
              }
            }
          }
        })
        .catch(error => {
          console.error('Other Errors', error)
          toast.error(error.toString())
          
          setService(null)
        })
    }
  }


  return (
    <>
    {
    loading ?
    <LoadingModal text={"Processing your payment, please wait..."} />
    :
    <Modal
      onOutsideClick={onCancel}
      additionalClasses={
        'p-8 2xl:w-4/12 xl:w-3/5 lg:w-4/5 sm:w-4/5 w-11/12 md:p-16'
      }
      alignment={undefined}
    >
      <div className="flex flex-col gap-6 w-full h-full rounded-lg text-lg">
        <div className="flex justify-between">
          <div className="text-2xl font-bold">Payment Method</div>
          <CloseButton
            onClick={onCancel}
            additionalClasses={'absolute top-6 right-6'}
          />
        </div>
        <Separator colorClass={'bg-cb-gray-400'} />
        <div className="flex flex-col md:flex-row gap-4 justify-center h-full">
          {PAYMENT_OPTIONS.map(option => (
            <Button
              key={option.name}
              variation={option.isAvailable ? 'secondary' : 'inactive'}
              selectable
              isSelected={selectedOption === option.name}
              onClick={() => {
                if (option.isAvailable) setSelectedOption(option.name)
              }}
            >
              <div className="flex justify-center items-center gap-2">
                <img className="h-10 aspect-square" src={option.icon} />
                <div className='relative'>
                  {option.name}
                  {option.testnet ?
                    <div className="absolute top-3/4 text-xs text-gray-400">
                      Testnet
                    </div>
                    : <></>
                  }
                </div>
                {!option.isAvailable ? (
                  <div className="rounded-full bg-cb-gray-400 text-xs px-2 py-1">
                    COMING SOON
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </Button>
          ))}
        </div>
        <Separator colorClass={'bg-cb-gray-400'} />
        <div className="text-xl font-bold">Fixed Pricing</div>
        <div className="flex justify-between">
          <div>Hourly Rate:</div>
          <div className="text-right">{HOURLY_RATE} ENTT / hour</div>
        </div>
        <Separator colorClass={'bg-cb-gray-400'} />
        <div className="flex justify-between text-xl font-bold">
          <div>Total:</div>
          <div>{HOURLY_RATE * hoursSelected} ENTT</div>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            onChange={() => setTermsAreAccepted(!termsAreAccepted)}
          />
          <div>
            I agree to CyborgNetwork's{' '}
            <a className="hover:cursor-pointer">
              Terms of Service and Conditions
            </a>
          </div>
        </div>
        <div className="flex flex-col-reverse justify-center gap-4">
          <Button variation="secondary" additionalClasses="w-full">
            Cancel
          </Button>
          <Button
            variation="primary"
            additionalClasses="w-full"
            onClick={startTransaction}
          >
            <div className="flex gap-2 justify-center">
              <div>Confirm Payment and Proceed to Upload</div>
              <TiArrowRight />
            </div>
          </Button>
        </div>
      </div>
    </Modal>
    }
    </>
  )
}

export default PaymentModal

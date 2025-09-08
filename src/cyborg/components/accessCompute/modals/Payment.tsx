import React, { useEffect, useState } from 'react'
import CloseButton from '../../general/buttons/CloseButton'
import { Separator } from '../../general/Separator'
import Modal from '../../general/modals/Modal'
import crypto from '../../../../../public/assets/icons/crypto.svg'
import fiat from '../../../../../public/assets/icons/fiat-currencty.svg'
import Button from '../../general/buttons/Button'
import { TiArrowRight } from 'react-icons/ti'
import { toast } from 'react-hot-toast'
import robo from '../../../../../public/assets/icons/robo.png'
import { usePriceQuery } from '../../../api/parachain/usePriceQuery'
import useTransaction from '../../../api/parachain/useTransaction'
import { useUserComputeHoursQuery } from '../../../api/parachain/useUserSubscription'
import { transformToNumber } from '../../../util/numberOperations'
import { useParachain } from '../../../context/PapiContext'
import { safeNumberToBigIntTransform } from '../../../util/numberOperations'

const PAYMENT_OPTIONS = [
  { name: 'ENTT', icon: robo, isAvailable: true, testnet: true },
  { name: 'Crypto', icon: crypto, isAvailable: false, testnet: false },
  { name: '', icon: fiat, isAvailable: false, testnet: false },
]

interface Props {
  onCancel: () => void
  onConfirm: () => void
  setService: () => void
}

const PaymentModal: React.FC<Props> = ({
  onCancel,
  onConfirm,
}: Props) => {
  const { account, parachainApi } = useParachain()

  const {
    data: computeHourPrice,
    //isLoading: computeHourPriceIsLoading,
    //error: computeHourPriceError
  } = usePriceQuery()

  const {
    data: userComputeHours,
    refetch
    //isLoading: userComputeHoursIsLoading,
    //error: userComputeHoursError 
  } = useUserComputeHoursQuery();

  const [selectedOption, setSelectedOption] = useState(PAYMENT_OPTIONS[0].name)
  const [termsAreAccepted, setTermsAreAccepted] = useState(false)
  const [hoursSelected, setHoursSelectedNumber] = useState<number | undefined>(undefined)
  const [totalSubscriptionCost, setTotalSubscriptionCost] = useState<bigint | null>(null)

  useEffect(() => {
    const calcTotalSubscriptionCost = (): void => {
      if (
        computeHourPrice === undefined || 
        hoursSelected === undefined ||
        computeHourPrice === null || 
        hoursSelected === null
      ) {
        setTotalSubscriptionCost(null)
        return
      }

      const hoursBigInt = safeNumberToBigIntTransform(hoursSelected)

      if (!hoursBigInt) {
        setTotalSubscriptionCost(0n)
        return
      }

      setTotalSubscriptionCost(computeHourPrice * hoursBigInt)
    }

    calcTotalSubscriptionCost()
  }, [computeHourPrice, hoursSelected])

  const startTransaction = () => {
    if (!termsAreAccepted) {
      toast("Please accept CyborgNetwork's Terms and Conditions!")
      return
    }

    if (!selectedOption) {
      toast('Please select a payment option!')
      return
    }

    if (hoursSelected && hoursSelected <= 0) {
      toast('Please select a valid number of hours!')
      return
    }

    submitTransaction()
  }

  const setHoursSelected = (hours: string) => {
    let numberHours = transformToNumber(hours)
    
    if(numberHours !== undefined && numberHours !== null)
    setHoursSelectedNumber(numberHours)
  }

  const { handleTransaction } = useTransaction()

  const submitTransaction = async (): Promise<void> => {
    if (!hoursSelected) {
      toast("Invalid number of hours selected!")
      return
    }

    const tx = userComputeHours > 0 
      ? parachainApi.tx.Payment.add_hours({ extra_hours: hoursSelected })
      : parachainApi.tx.Payment.subscribe({ hours: hoursSelected })

    await handleTransaction({
      tx,
      account,
      onSuccessFn: () => {
          onConfirm()
          refetch()
      },
      txName: "Top Up"
    })
  }

  return (
    <Modal
      onOutsideClick={onCancel}
      additionalClasses={
        'p-8 2xl:w-4/12 xl:w-3/5 lg:w-4/5 sm:w-4/5 w-11/12 md:p-16'
      }
    >
      <div className="flex flex-col gap-6 w-full h-full rounded-lg text-lg">
        <div className="flex justify-between">
          <div className="text-2xl font-bold">{userComputeHours > 0 ? "Extend Subscription" : "Subscribe"}</div>
          <CloseButton
            type="button"
            onClick={onCancel}
            additionalClasses={'absolute top-6 right-6'}
          />
        </div>
        <Separator colorClass={'bg-cb-gray-400'} />
        <input
          type="text"
          className="bg-cb-gray-700 text-white border border-gray-600 focus:border-cb-green focus:outline-none p-2 rounded w-16 sm:w-auto"
          placeholder="Number of Hours"
          onChange={e => setHoursSelected(e.target.value)}
        />
        <Separator colorClass={'bg-cb-gray-400'} />
        <div className="flex flex-col md:flex-row gap-4 justify-center h-full">
          {PAYMENT_OPTIONS.map(option => (
            <Button
              type="button"
              key={option.name}
              variation={option.isAvailable ? 'secondary' : 'inactive'}
              selectable={{ isSelected: selectedOption === option.name }}
              onClick={() => {
                if (option.isAvailable) setSelectedOption(option.name)
              }}
            >
              <div className="flex justify-center items-center gap-2">
                <img
                  className="h-10 aspect-square"
                  alt="Currency"
                  src={option.icon}
                />
                <div className="relative">
                  {option.name}
                  {option.testnet ? (
                    <div className="absolute top-3/4 text-xs text-gray-400">
                      Testnet
                    </div>
                  ) : (
                    <></>
                  )}
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
          <div className="text-right">{`${computeHourPrice ? computeHourPrice : 0} ENTT / hour`}</div>
        </div>
        <Separator colorClass={'bg-cb-gray-400'} />
        <div className="flex justify-between text-xl font-bold">
          <div>Total:</div>
          <div>{`${totalSubscriptionCost} ENTT`}</div>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            onChange={() => setTermsAreAccepted(!termsAreAccepted)}
          />
          <div>
            I agree to CyborgNetwork's{' '}
            <a
              href="https://github.com/Cyborg-Network/cyborg-parachain/blob/master/Local%20Testing.md"
              className="hover:cursor-pointer"
            >
              Terms of Service and Conditions
            </a>
          </div>
        </div>
        <div className="flex flex-col-reverse justify-center gap-4">
          <Button
            type="button"
            selectable={false}
            onClick={onCancel}
            variation="secondary"
            additionalClasses="w-full"
          >
            Cancel
          </Button>
          <Button
            type="button"
            selectable={false}
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
  )
}

export default PaymentModal

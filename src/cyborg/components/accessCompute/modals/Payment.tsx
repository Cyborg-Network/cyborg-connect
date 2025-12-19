import React, { useEffect, useState } from 'react'
import CloseButton from '../../general/buttons/CloseButton'
import { Separator } from '../../general/Separator'
import Modal from '../../general/modals/Modal'
import crypto from '../../../../../public/assets/icons/crypto.svg'
import fiat from '../../../../../public/assets/icons/fiat-currencty.svg'
import dot from '../../../../../public/assets/icons/dot.svg'
import usdt from '../../../../../public/assets/icons/usdt.svg'
import usdc from '../../../../../public/assets/icons/usdc.svg'
import Button from '../../general/buttons/Button'
import { TiArrowRight } from 'react-icons/ti'
import { toast } from 'react-hot-toast'
import robo from '../../../../../public/assets/icons/robo.png'
import { usePriceQuery } from '../../../api/parachain/usePriceQuery'
import { useAssetPriceQuery } from '../../../api/parachain/useAssetPriceQuery'
import useTransaction from '../../../api/parachain/useTransaction'
import { useUserComputeHoursQuery } from '../../../api/parachain/useUserSubscription'
import { transformToNumber } from '../../../util/numberOperations'
import { useParachain } from '../../../context/PapiContext'
import { safeNumberToBigIntTransform } from '../../../util/numberOperations'

// Asset configuration
const ASSETS = [
  {
    id: 0,
    name: 'ENTT',
    symbol: 'ENTT',
    icon: robo,
    isAvailable: true,
    testnet: true,
    isNative: true
  },
  {
    id: 1,
    name: 'USDT',
    symbol: 'USDT',
    icon: usdt,
    isAvailable: true,
    testnet: false,
    isNative: false
  },
  {
    id: 2,
    name: 'USDC',
    symbol: 'USDC',
    icon: usdc,
    isAvailable: true,
    testnet: false,
    isNative: false
  },
  {
    id: 3,
    name: 'BORG',
    symbol: 'BORG',
    icon: crypto,
    isAvailable: true,
    testnet: false,
    isNative: false
  },
  {
    id: 3,
    name: 'DOT',
    symbol: 'DOT',
    icon: dot,
    isAvailable: true,
    testnet: false,
    isNative: false
  },
]

const PAYMENT_OPTIONS = [
  { name: 'Crypto', icon: crypto, isAvailable: true, testnet: false },
  { name: 'FIAT', icon: fiat, isAvailable: false, testnet: false },
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
    data: nativeComputeHourPrice,
  } = usePriceQuery()

  const {
    data: userComputeHours,
    refetch
    //isLoading: userComputeHoursIsLoading,
    //error: userComputeHoursError 
  } = useUserComputeHoursQuery();

  const [selectedPaymentOption, setSelectedPaymentOption] = useState(PAYMENT_OPTIONS[0].name)
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0])
  const [termsAreAccepted, setTermsAreAccepted] = useState(false)
  const [hoursSelected, setHoursSelectedNumber] = useState<number | undefined>(undefined)
  const [totalSubscriptionCost, setTotalSubscriptionCost] = useState<bigint | null>(null)
  const [assetPrice, setAssetPrice] = useState<bigint | null>(null)

  // Fetch asset price when asset changes
  const { data: assetPriceData } = useAssetPriceQuery(selectedAsset.id)

  useEffect(() => {
    if (selectedAsset.isNative) {
      setAssetPrice(nativeComputeHourPrice || null)
    } else {
      setAssetPrice(assetPriceData || null)
    }
  }, [selectedAsset, nativeComputeHourPrice, assetPriceData])

  useEffect(() => {
    const calcTotalSubscriptionCost = (): void => {
      if (
        assetPrice === null ||
        hoursSelected === undefined ||
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

      setTotalSubscriptionCost(assetPrice * hoursBigInt)
    }

    calcTotalSubscriptionCost()
  }, [assetPrice, hoursSelected, selectedAsset])

  const startTransaction = () => {
    if (!termsAreAccepted) {
      toast("Please accept CyborgNetwork's Terms and Conditions!")
      return
    }

    if (!selectedPaymentOption) {
      toast('Please select a payment option!')
      return
    }

    if (hoursSelected && hoursSelected <= 0) {
      toast('Please select a valid number of hours!')
      return
    }

    if (!assetPrice || assetPrice === 0n) {
      toast('Price information not available for selected asset!')
      return
    }

    submitTransaction()
  }

  const setHoursSelected = (hours: string) => {
    let numberHours = transformToNumber(hours)

    if (numberHours !== undefined && numberHours !== null)
      setHoursSelectedNumber(numberHours)
  }

  const { handleTransaction } = useTransaction()

  const submitTransaction = async (): Promise<void> => {
    if (!hoursSelected) {
      toast("Invalid number of hours selected!")
      return
    }

    let tx;

    if (selectedAsset.isNative) {
      // Use native token transaction
      tx = userComputeHours > 0
        ? parachainApi.tx.Payment.add_hours({ extra_hours: hoursSelected })
        : parachainApi.tx.Payment.subscribe({ hours: hoursSelected })
    } else {
      // Use asset-based transaction
      if (userComputeHours > 0) {
        tx = parachainApi.tx.Payment.add_hours_with_asset({
          asset_id: selectedAsset.id,
          extra_hours: hoursSelected
        })
      } else {
        tx = parachainApi.tx.Payment.subscribe_with_asset({
          asset_id: selectedAsset.id,
          hours: hoursSelected
        })
      }
    }

    await handleTransaction({
      tx,
      account,
      onSuccessFn: () => {
        onConfirm()
        refetch()
      },
      txName: selectedAsset.isNative ? "Top Up" : `Top Up with ${selectedAsset.symbol}`,
      assetId: selectedAsset.id
    })
  }

  return (
    <Modal
      onOutsideClick={onCancel}
      additionalClasses={
        'p-8 2xl:w-4/12 xl:w-3/5 lg:w-4/5 sm:w-4/5 w-11/12 md:p-16 border border-color-text-1'
      }
    >
      <div className="flex flex-col gap-6 w-full h-full rounded-lg text-lg">
        <div className="flex justify-between">
          <div className="text-2xl font-bold text-color-text-1">{userComputeHours > 0 ? "Extend Subscription" : "Subscribe"}</div>
          <CloseButton
            type="button"
            onClick={onCancel}
            additionalClasses={'absolute top-6 right-6'}
          />
        </div>
        <Separator colorClass={'bg-color-background-4'} />

        {/* Hours Input */}
        <div className="flex flex-col gap-2">
          <label className="text-color-text-1">Number of Hours</label>
          <input
            type="text"
            className="bg-color-background-1 text-color-text-1 border border-gray-600 focus:border-color-foreground focus:outline-none p-2 rounded w-full"
            placeholder="Enter number of hours"
            onChange={e => setHoursSelected(e.target.value)}
          />
        </div>

        <Separator colorClass={'bg-color-background-4'} />

        {/* Payment Method Selection */}
        <div className="flex flex-col gap-4">
          <div className="text-xl font-bold text-color-text-1">Payment Method</div>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {PAYMENT_OPTIONS.map(option => (
              <Button
                type="button"
                key={option.name}
                variation={option.isAvailable ? 'secondary' : 'inactive'}
                selectable={{ isSelected: selectedPaymentOption === option.name }}
                onClick={() => {
                  if (option.isAvailable) setSelectedPaymentOption(option.name)
                }}
                additionalClasses="flex-1 text-color-text-2"
              >
                <div className="flex justify-center items-center gap-2">
                  <img
                    className="h-10 aspect-square"
                    alt="Currency"
                    src={option.icon}
                  />
                  <div className="relative text-color-text-2">
                    {option.name}
                    {option.testnet ? (
                      <div className="absolute top-3/4 text-xs text-color-text-2">
                        Testnet
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  {!option.isAvailable ? (
                    <div className="rounded-full bg-color-background-4 text-xs px-2 py-1 text-color-text-2">
                      COMING SOON
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Asset Selection */}
        {selectedPaymentOption === 'Crypto' && (
          <>
            <Separator colorClass={'bg-color-background-4'} />
            <div className="flex flex-col gap-4">
              <div className="text-xl font-bold text-color-text-1">Select Asset</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ASSETS.map(asset => (
                  <Button
                    type="button"
                    key={asset.id}
                    variation={asset.isAvailable ? 'secondary' : 'inactive'}
                    selectable={{ isSelected: selectedAsset.id === asset.id }}
                    onClick={() => {
                      if (asset.isAvailable) setSelectedAsset(asset)
                    }}
                    additionalClasses="h-32"
                  >
                    <div className="flex flex-col justify-center items-center gap-2">
                      <img
                        className="h-10 aspect-square"
                        alt={asset.name}
                        src={asset.icon}
                      />
                      <div className="text-center">
                        <div className="font-semibold text-color-text-2">{asset.symbol}</div>
                        <div className="text-sm text-gray-400">{asset.name}</div>
                        {asset.testnet && (
                          <div className="text-xs text-gray-400">Testnet</div>
                        )}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator colorClass={'bg-color-background-4'} />

        {/* Pricing Information */}
        <div className="text-xl font-bold text-color-text-1">Fixed Pricing</div>
        <div className="flex justify-between text-color-text-1">
          <div>Hourly Rate:</div>
          <div className="text-right">
            {assetPrice !== null 
              ? `${assetPrice} ${selectedAsset.symbol} / hour`
              : `Loading...`
            }
          </div>
        </div>

        <Separator colorClass={'bg-color-background-4'} />

        {/* Total Cost */}
        <div className="flex justify-between text-xl font-bold text-color-text-1">
          <div>Total:</div>
          <div>
            {totalSubscriptionCost !== null
              ? `${totalSubscriptionCost} ${selectedAsset.symbol}`
              : `Calculating...`
            }
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex gap-2 items-center text-color-text-1">
          <input
            type="checkbox"
            onChange={() => setTermsAreAccepted(!termsAreAccepted)}
          />
          <div>
            I agree to CyborgNetwork's{' '}
            <a
              href="https://github.com/Cyborg-Network/cyborg-parachain/blob/master/Local%20Testing.md"
              className="hover:cursor-pointer text-color-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service and Conditions
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-center gap-4">
          <Button
            type="button"
            selectable={false}
            onClick={onCancel}
            variation="secondary"
            additionalClasses="w-full sm:flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            selectable={false}
            variation="primary"
            additionalClasses="w-full sm:flex-1"
            onClick={startTransaction}
          >
            <div className="flex gap-2 justify-center items-center">
              <div>Confirm Payment with {selectedAsset.symbol}</div>
              <TiArrowRight />
            </div>
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default PaymentModal

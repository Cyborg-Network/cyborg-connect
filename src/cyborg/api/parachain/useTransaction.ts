import { useState } from 'react'
import { Transaction } from 'polkadot-api'
import { processError, processEvent } from '../../util/trackTx'
import { InjectedPolkadotAccount} from 'polkadot-api/pjs-signer'
import toast from 'react-hot-toast'
import { useToast } from '../../context/ToastContext'

interface Input {
  tx: Transaction<any, any, any, any>
  account: InjectedPolkadotAccount | undefined,
  onSuccessFn?: () => void,
  userCallToAction?: {
    fn: () => void,
    text: string
  }
  txName: string,
  assetId?: number,
}

export const useTransaction = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  const handleTransaction = async ({ 
    tx, 
    account, 
    onSuccessFn, 
    txName, 
    userCallToAction,
    assetId 
  }: Input) => {
    setIsLoading(true);
    
    if (!account) {
      toast("Please connect an account to sign the transaction!")
      return
    }

    // Add asset information to transaction tracking if available
    const enhancedTxName = assetId ? `${txName} (Asset: ${assetId})` : txName

    tx.signSubmitAndWatch(account.polkadotSigner).subscribe({
      next: (event) => {
        processEvent({
          event, 
          txName: enhancedTxName, 
          showToast, 
          userCallToAction
        })
      },
      error: (error) => {
        processError(error, enhancedTxName, showToast) 
      },
      complete() {
        setIsLoading(false)
        if(onSuccessFn) {
          onSuccessFn()
        }
      },
    })
  }

  return { handleTransaction, isLoading }
}

export default useTransaction

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
}

export const useTransaction = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  const handleTransaction = async ({ tx, account, onSuccessFn, txName, userCallToAction }: Input) => {
    setIsLoading(true);
    
    if (!account) {
      toast("Please connect an account to sign the transaction!")
      return
    }

    tx.signSubmitAndWatch(account.polkadotSigner).subscribe({
      next: (event) => {
        // To track the tx based on events and for errors that get returned after a while eg. dispatch errors
        processEvent({event, txName, showToast, userCallToAction})
      },
      error: (error) => {
        // For errors that get returned right away eg. invalid nonce
        processError(error, txName, showToast) 
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

import { cyborgParachain } from "@polkadot-api/descriptors";
import { InvalidTxError, TransactionValidityError, TxEvent } from "polkadot-api";
import { CyborgParachainDispatchError } from "@polkadot-api/descriptors";
import { ToastMessage } from "../context/ToastContext";

type Input = {
    event: TxEvent,
    txName: string,
    showToast: (msg: ToastMessage) => void,
    userCallToAction?: {
        fn: () => void,
        text: string
    }
}

export const processEvent = ({event, txName, showToast, userCallToAction}: Input) => {
    switch (event.type) {
        case "signed":
        case "broadcasted":
            console.log(`Event for ${event.txHash}: ${event.type}`)
            showToast(
                {
                    title: "Transaction Update",
                    type: "tx", 
                    txHash: event.txHash,
                    text: `Transaction ${txName} is ${event.type}!`, 
                }
            )
            break

        case "txBestBlocksState":
            if(event.found) {
                if(event.ok){
                    console.log(`Event for ${txName} transaction: ${event.txHash}: ${event.type}`)
                    if(!userCallToAction){
                        showToast(
                            {
                                title: "Transaction Update",
                                type: "tx", 
                                txHash: event.txHash,
                                text: `Transaction ${txName} is in best block!`, 
                            }
                        )
                        return
                    }
                    showToast(
                        {
                            title: "Transaction Update",
                            type: "tx", 
                            text: `Transaction ${txName} is in best block!`, 
                            txHash: event.txHash,
                            action: {
                                fn: userCallToAction.fn,
                                text: userCallToAction.text
                            }
                        }
                    )
                } else if(!event.ok && event.dispatchError) {
                    const err = event.dispatchError as CyborgParachainDispatchError
                    const formattedError = formatDispatchError(err)
                    showToast(
                        {
                            title: "Transaction Failed",
                            txHash: event.txHash,
                            type: "tx", 
                            text: `Dispatch Error: ${formattedError}`, 
                            isErr: true
                        }
                    )
                    console.error(`Dispatch Error: ${formattedError}`)
                } else {
                    showToast(
                        {
                            title: "Transaction Failed",
                            type: "tx", 
                            txHash: event.txHash,
                            text: `${txName} transaction failed without a dispatch error!`, 
                            isErr: true
                        }
                    )
                }
            }
            break

        case "finalized":
            if(event.ok){
                    console.log(`Event for ${txName} transaction: ${event.txHash}: ${event.type}`)
                    if(!userCallToAction){
                        showToast(
                            {
                                title: "Transaction Update",
                                type: "tx", 
                                text: `Transaction ${txName} is finalized!`, 
                                txHash: event.txHash,
                            }
                        )
                        return
                    }
                    showToast(
                        {
                            title: "Transaction Update",
                            type: "tx", 
                            text: `Transaction ${txName} is finalized!`, 
                            txHash: event.txHash,
                            action: {
                                fn: userCallToAction.fn,
                                text: userCallToAction.text
                            }
                        }
                    )
                } else if(!event.ok && event.dispatchError) {
                    const err = event.dispatchError as CyborgParachainDispatchError
                    const formattedError = formatDispatchError(err)
                    showToast(
                        {
                            title: "Transaction Failed",
                            txHash: event.txHash,
                            type: "tx", 
                            text: `Dispatch Error: ${formattedError}`, 
                            isErr: true
                        }
                    )
                    console.error(`Dispatch Error: ${formattedError}`)
                } else {
                    showToast(
                        {
                            title: "Transaction Failed",
                            txHash: event.txHash,
                            type: "tx", 
                            text: `${txName} transaction failed without a dispatch error!`, 
                            isErr: true
                        }
                    )
                }
                break
    }
}

export const processError = (error: any, txName: string, showToast: (msg: ToastMessage) => void) => {
    if (error instanceof InvalidTxError) {
        const typedError: TransactionValidityError<typeof cyborgParachain> = error.error
        showToast(
            {
                title: "Transaction Failed",
                txHash: "N/A",
                type: "tx", 
                text: `${txName} transaction is invalid (eg. due to a invalid nonce.), please try again.`, 
                isErr: true
            }
        )
        console.log(typedError)
    } else {
        showToast(
            {
                title: "Transaction Failed",
                txHash: "N/A",
                type: "tx", 
                text: `${txName} transaction failed, please try again. More information can be found in the console.`, 
                isErr: true
            }
        )
        console.log(error)
    }
}

const formatDispatchError = (err: CyborgParachainDispatchError): string => {
    switch (err.type) {
        case "Module":
            return `Module: (${err.value.type}.${err.value.value.type})`
        default:
            return `${err.type}: (${err.value.type}.${err.value.value})`
    }
}
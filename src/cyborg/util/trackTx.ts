import { cyborgParachain } from "@polkadot-api/descriptors";
import { InvalidTxError, TransactionValidityError, TxEvent } from "polkadot-api";
import { CyborgParachainDispatchError } from "@polkadot-api/descriptors";
import toast from "react-hot-toast";

export const processEvent = (event: TxEvent, txName: string) => {
    switch (event.type) {
        case "signed":
        case "broadcasted":
            console.log(`Event for ${event.txHash}: ${event.type}`)
            toast(`${txName} transaction ${event.txHash} ${event.type}!`)
            break

        case "txBestBlocksState":
            if(event.found) {
                if(event.ok){
                    console.log(`Event for ${txName} transaction: ${event.txHash}: ${event.type}`)
                    toast(`${txName} transaction ${event.txHash} is in the best block!`)
                } else if(!event.ok && event.dispatchError) {
                    toast(`${txName} transaction ${event.txHash} failed! Check the console for dispatch error!`)
                    const err = event.dispatchError as CyborgParachainDispatchError
                    console.error(`Dispatch Error: ${formatDispatchError(err)}`)
                } else {
                    toast(`${txName} transaction ${event.txHash} failed without a dispatch error!`)
                }
            }
            break

        case "finalized":
            if(event.ok){
                    console.log(`Event for ${txName} transaction: ${event.txHash}: ${event.type}`)
                    toast(`${txName} transaction ${event.txHash} is finalized!`)
                } else if(!event.ok && event.dispatchError) {
                    toast(`${txName} transaction ${event.txHash} failed! Check the console for dispatch error!`)
                    const err = event.dispatchError as CyborgParachainDispatchError
                    console.error(`Dispatch Error: ${formatDispatchError(err)}`)
                } else {
                    toast(`${txName} transaction ${event.txHash} failed without a dispatch error!`)
            }
            break
    }
}

export const processError = (error: any, txName: string) => {
    if (error instanceof InvalidTxError) {
        const typedError: TransactionValidityError<typeof cyborgParachain> = error.error
        toast(`${txName} transaction is invalid (eg. due to a invalid nonce.), please try again.`)
        console.log(typedError)
    } else {
        toast(`${txName} transaction failed, please try again. More information can be found in the console.`)
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
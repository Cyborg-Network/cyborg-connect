import { TxEvent } from "polkadot-api";
import toast from "react-hot-toast";

export const processEvent = (event: TxEvent, txName: string) => {
    if(event.type === "txBestBlocksState" && event.found) {
        console.log(`Event for ${txName} transaction: ${event.txHash}: ${event.type}`)
        toast(`${txName} transaction ${event.txHash} is in the best block!`)
    } else {
        console.log(`Event for ${event.txHash}: ${event.type}`)
        toast(`${txName} transaction ${event.txHash} ${event.type}!`)
    }
}

export const processError = (error: any, txName: string) => {
    toast(`${txName} transaction failed, please try again. More information can be found in the console.`)
    console.log(error)
}
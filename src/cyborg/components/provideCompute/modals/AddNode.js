import { useState } from "react";
import { useSubstrateState } from "../../../../substrate-lib";
import { getAccount } from "../../../util/getAccount";
import { toast } from "react-hot-toast";
import CopyToClipboard from "react-copy-to-clipboard";
import { IoMdCopy } from "react-icons/io";
import Modal from "../../general/modals/Modal";
import CloseButton from "../../general/buttons/CloseButton";
import Button from "../../general/buttons/Button";
import {Separator} from "../../general/Separator";

function AddNodeModal({onCancel}) {

    const [deployIP, setDeployIP] = useState("");
    const [copyToClipboardWasClicked, setCopyToClipboardWasClicked] = useState(false);
    const { api, currentAccount } = useSubstrateState();

    const returnMasterNodeURL = (masterNodeIpAndPort) => `http://${masterNodeIpAndPort}/cluster-status`;

    const returnWorkerClusterIsReachable = async (url, timeout = 5000) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        try{
            const response = await fetch(url, {undefined, signal: controller.signal})

            clearTimeout(timeoutId)

            console.log(await response.text());

            return true;
        } catch(e) {
            toast("Worker Node is not reachable... Aborted.");
            return false;
        }
    }

    const handleDispatchError = (dispatchError) => {
        if (dispatchError) {
            if (dispatchError.isModule) {
                // for module errors, we have the section indexed, lookup
                const decoded = api.registry.findMetaError(dispatchError.asModule);
                const { docs, name, section } = decoded;
                toast.error(`Dispatch Module Error: ${section}.${name}: ${docs.join(' ')}`);
                console.error(`Dispatch Module Error: ${section}.${name}: ${docs.join(' ')}`);
            } else {
                // Other, CannotLookup, BadOrigin, no extra info
                toast.error(`Dispatch Module Error: ${dispatchError.toString()}`);
                console.error(`Dispatch Module Error: ${dispatchError.toString()}`);
            }
        }
    }

    const findModuleErrorsInBlock = (status, events) => {
        if (status.isInBlock || status.isFinalized) {
            // find/filter for failed events
            const failedEvents = events.filter( event => api.events.system.ExtrinsicFailed.is(event) )
                    // we know that data for system.ExtrinsicFailed is (DispatchError, DispatchInfo)
            failedEvents.forEach(({ event: { data: [error, info] } }) => {
                if (error.isModule) {
                    // for module errors, we have the section indexed, lookup
                    const decoded = api.registry.findMetaError(error.asModule);
                    const { docs, method, section } = decoded;
                    toast.error(`${section}.${method}: ${docs.join(' ')}`);
                    console.error(`${section}.${method}: ${docs.join(' ')}`);
                } else {
                    // Other, CannotLookup, BadOrigin, no extra info
                    toast.error(error.toString());
                    console.error(error.toString());
                }
            });
            const success = events.filter(({ event }) =>
                api.events.taskManagement.TaskScheduled.is(event)
            )
            if ( success.length > 0 ) {
                console.log(success)
            }
        }
    }

    const handleAddNode = async (clickEvent) => {

        clickEvent.preventDefault();

        //setNodeStatus("waiting")

        if(await returnWorkerClusterIsReachable(returnMasterNodeURL(deployIP), 5000)){
    
            const fromAcct = await getAccount(currentAccount);

            await api.tx.edgeConnect.registerWorker(undefined, deployIP)
                .signAndSend(...fromAcct,({ status, events, dispatchError }) => {
                    handleDispatchError(dispatchError);
                    findModuleErrorsInBlock(status, events);
                    //setNodeStatus("deployed");
                    //setTimeout(() => setNodeStatus(""), 2000);
                }).catch((error) => {
                    console.error("Other Errors", error);
                    toast.error(error.toString());
                });
        }else{
            //setNodeStatus("")
        }
    }

    const handleCopyToClipboardClick = () => {
      toast('Copied!');
      setCopyToClipboardWasClicked(true);
    }

    return(
        <Modal additionalClasses='flex flex-col gap-6'>
            <CloseButton additionalClasses='absolute top-6 right-6' onClick={() => onCancel()} />
            <div className="text-2xl">Deploy Master Node</div>
            <Separator colorClass={'bg-cb-gray-500'}/>
            <div className='relative h-fit'>
                <input 
                    type='text'
                    placeholder='Insert the public IP address of your node...'
                    onChange={(e) => {setDeployIP(e.target.value)}}
                    className='w-full p-3.5 bg-cb-gray-500 border border-cb-gray-600 text-white rounded-lg focus:border-cb-green focus:ring-cb-green focus:outline-none' 
                    required
                />
                <CopyToClipboard text={deployIP}>
                    <button onClick={() => handleCopyToClipboardClick()} className={`absolute rounded-lg bg-cb-gray-400 right-2 top-1/2 -translate-y-1/2 ${copyToClipboardWasClicked ? 'text-cb-green' : 'text-white'}`}><IoMdCopy size={25}/></button>
                </CopyToClipboard>
            </div>
            <Separator colorClass={'bg-cb-gray-500'}/>
            <Button variation='primary' additionalClasses='w-full' onClick={(e)=> handleAddNode(e)} 
                className='flex w-1/2 items-center text-cb-gray-500 self-center justify-center gap-1 size-30 py-3 px-6 rounded-md bg-cb-green focus:bg-cb-gray-500 focus:text-cb-green'
            >
                Deploy
            </Button>
        </Modal>
    )
}

export default AddNodeModal
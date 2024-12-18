import { useSubstrateState } from "../../../../substrate-lib";
import { getAccount } from "../../../util/getAccount";
import { toast } from "react-hot-toast";
import Modal from "../../general/modals/Modal";
import CloseButton from "../../general/buttons/CloseButton";
import Button from "../../general/buttons/Button";
import {Separator} from "../../general/Separator";
import { useState } from "react";
import LoadingModal from "../../general/modals/Loading";
import { useCyborg } from "../../../CyborgContext";

function RemoveNodeModal({nodeInfo, onCancel}) {

    const [loading, setLoading] = useState(false);

    const { api, currentAccount } = useSubstrateState();
    const { setReloadWorkers } = useCyborg()

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
                api.events.edgeConnect.WorkerRemoved.is(event)
            )
            if ( success.length > 0 ) {
                console.log(success)
                setLoading(false)
                onCancel()
                setReloadWorkers(true) 
            }
        }
    }

    const handleRemoveNode = async (clickEvent) => {

      clickEvent.preventDefault();

      setLoading(true);

    
      const fromAcct = await getAccount(currentAccount);

      await api.tx.edgeConnect.removeWorker(
        nodeInfo.workerType,
        nodeInfo.id
      )
        .signAndSend(...fromAcct,({ status, events, dispatchError }) => {
          handleDispatchError(dispatchError);
          findModuleErrorsInBlock(status, events);
          //setNodeStatus("deployed");
          //setTimeout(() => setNodeStatus(""), 2000);
          }).catch((error) => {
            console.error("Other Errors", error);
            toast.error(error.toString());
          });
    }

    return(
        <>
        {
        !loading
        ?
        <Modal additionalClasses='flex flex-col gap-6'>
            <CloseButton additionalClasses='absolute top-6 right-6' onClick={() => onCancel()} />
            <div className="text-2xl">Remove this Worker?</div>
            <div>
              After the node has been removed it will need to be registered again.
            </div>
            <Separator colorClass={'bg-cb-gray-500'}/>
            <div>
              <div>Worker ID: {nodeInfo.id}</div>
              <div>Worker Type: {nodeInfo.workerType.charAt(0).toUpperCase() + nodeInfo.workerType.slice(1)}</div>
            </div>
            <Separator colorClass={'bg-cb-gray-500'}/>
            <Button variation='primary' additionalClasses='w-full' onClick={(e)=> handleRemoveNode(e)} 
                className='flex w-1/2 items-center text-cb-gray-500 self-center justify-center gap-1 size-30 py-3 px-6 rounded-md bg-cb-green focus:bg-cb-gray-500 focus:text-cb-green'
            >
                Remove
            </Button>
        </Modal>
        :
        <LoadingModal text={"Removing your worker..."}/>
        }
        </>
    )
}

export default RemoveNodeModal

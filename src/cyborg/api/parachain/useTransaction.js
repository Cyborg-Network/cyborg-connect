import { useRef, useState } from "react";
import { getAccount } from "../../util/getAccount";

const handleTransactionEvents = (api, events) => {
  let hasErrored = false;
  let successfulEvents = [];
  let errorEvents = [];

  events.forEach(({ event }) => {
    const eventData = event.data.toHuman();
    console.log(`Event: ${event.section}.${event.method} ->`, eventData);

    if (event.section === "system" && event.method === "ExtrinsicFailed") {
      hasErrored = true;

      const [dispatchError] = event.data;
      let errorMessage = "Unknown error";

      if (dispatchError.isModule) {
        const decoded = api.registry.findMetaError(dispatchError.asModule);
        errorMessage = `${decoded.section}.${decoded.name}: ${decoded.documentation.join(" ")}`;
      } else {
        errorMessage = dispatchError.toString();
      }

      console.error("Extrinsic error:", errorMessage);
      errorEvents.push({ event: event.method, message: errorMessage });
    } else if (event.section === "system" && event.method === "ExtrinsicSuccess") {
      successfulEvents.push(event);
    }
  });

  return { hasErrored, successfulEvents, errorEvents };
};

export const useTransaction = (api) => {
  const [isLoading, setIsLoading] = useState(false);
  const onIsInBlockWasCalledRef = useRef(false);

  const handleTransaction = async ({ tx, account, onSuccess, onError }) => {
    if (!api || !tx || !account) {
      console.error("Missing required parameters: API, transaction, or account.");
      return;
    }

    const fromAcct = await getAccount(account);
    if (!fromAcct) {
      console.error("Failed to retrieve account.");
      return;
    }

    try {
      await tx.signAndSend(...fromAcct, ({ status, events, dispatchError }) => {
        setIsLoading(true);

        if (dispatchError) {
          console.error("Dispatch Error:", dispatchError.toHuman());
          setIsLoading(false);
          if (onError) onError(dispatchError);
          return;
        }

        if (status.isInBlock || status.isFinalized) {
          if(status.isInBlock)
          console.log(`Transaction included in block: ${status.asInBlock}`);

          if(status.isFinalized)
          console.log(`Transaction finalized: ${status.asFinalized}`);

          const { hasErrored, successfulEvents, errorEvents } = handleTransactionEvents(api, events);

          if (hasErrored) {
            console.warn("Transaction failed.", errorEvents);
            setIsLoading(false);
            if (onError) onError(errorEvents);
          } else if (successfulEvents && !onIsInBlockWasCalledRef.current) {
            onIsInBlockWasCalledRef.current = true;
            console.log("Transaction successful:", successfulEvents);
            setIsLoading(false);
            if (onSuccess) onSuccess(successfulEvents);
          }
        }
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      setIsLoading(false);
      if (onError) onError(error);
    }
  };

  return { handleTransaction, isLoading };
}

export default useTransaction

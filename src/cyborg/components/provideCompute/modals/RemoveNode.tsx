import Modal from '../../general/modals/Modal'
import CloseButton from '../../general/buttons/CloseButton'
import Button from '../../general/buttons/Button'
import { Separator } from '../../general/Separator'
import LoadingModal from '../../general/modals/Loading'
import useTransaction from '../../../api/parachain/useTransaction'
import React from 'react'
import { useParachain } from '../../../context/PapiContext'
import { Binary, Enum } from 'polkadot-api'
import { Miner } from '../../../api/parachain/useWorkersQuery'

interface Props {
  nodeInfo: { workerType: string; id: Miner["id"] }
  onCancel: () => void
}

const RemoveNodeModal: React.FC<Props> = ({ nodeInfo, onCancel }: Props) => {
  const { parachainApi, account } = useParachain()

  const { handleTransaction, isLoading } = useTransaction()

  console.log(nodeInfo)

  const submitTransaction = async () => {
    const tx = parachainApi.tx.EdgeConnect.remove_miner(
      {
        miner_type: Enum("Cloud"),
        miner_id: Binary.fromText(nodeInfo.id)
      }
    )

    await handleTransaction({
      tx,
      account,
      txName: "Remove Miner"
    })
  }

  return (
    <>
      {!isLoading ? (
        <Modal
          onOutsideClick={onCancel}
          additionalClasses="flex flex-col gap-6"
        >
          <CloseButton
            type="button"
            additionalClasses="absolute top-6 right-6"
            onClick={() => onCancel()}
          />
          <div className="text-2xl">Remove this Worker?</div>
          <div>
            After the node has been removed it will need to be registered again.
          </div>
          <Separator colorClass={'bg-color-background-3'} />
          <div>
            <div>Worker ID: {nodeInfo.id.toString()}</div>
          </div>
          <Separator colorClass={'bg-color-background-3'} />
          <Button
            type="button"
            selectable={false}
            variation="primary"
            additionalClasses="w-full"
            onClick={e => submitTransaction()}
            //className='flex w-1/2 items-center text-color-background-3 self-center justify-center gap-1 size-30 py-3 px-6 rounded-md bg-color-foreground focus:bg-color-background-3 focus:text-color-foreground'
          >
            Remove
          </Button>
        </Modal>
      ) : (
        <LoadingModal text={'Removing your worker...'} />
      )}
    </>
  )
}

export default RemoveNodeModal

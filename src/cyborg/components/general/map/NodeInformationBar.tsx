import React from 'react'
import Button from '../buttons/Button'
import { TiArrowRight } from 'react-icons/ti'
import TruncatedAddress from '../TruncatedAddress'
import { useState } from 'react'
import Modal from '../modals/Modal'
import { toast } from 'react-hot-toast'
import { transformToNumber, safeNumberToBigIntTransform } from '../../../util/numberOperations'
import { Miner } from '../../../api/parachain/useWorkersQuery'

interface Props {
  node: Miner
  distance: number
  returntoNearestNode: () => void
  onNavigate: () => void
  handleManualSelection: (nodeId: bigint, nodeOwner: string) => void
}

interface ManualSelectionModalProps {
  handleManualSelection: (nodeId: bigint, nodeOwner: string) => void
}

const NodeInformationBar: React.FC<Props> = ({
  node,
  distance,
  returntoNearestNode,
  onNavigate,
  handleManualSelection,
}: Props) => {
  const [manualSelectionModalIsActive, setManualSelectionModalIsActive] =
    useState(false)

  const ManualSelectionModal: React.FC<ManualSelectionModalProps> = ({
    handleManualSelection,
  }: ManualSelectionModalProps) => {
    const [nodeInfo, setNodeInfo] = useState<{
      id: null | number
      owner: null | string
    }>({ id: null, owner: null })

    const returnManualSelection = () => {
      const bigIntId = safeNumberToBigIntTransform(nodeInfo.id)
      if (bigIntId && nodeInfo.owner) {
        handleManualSelection(bigIntId, nodeInfo.owner)
        setManualSelectionModalIsActive(false)
      } else {
        toast('Please enter all of the required information!')
      }
    }

    return (
      <Modal
        additionalClasses="flex flex-col gap-4 items-center"
        onOutsideClick={() => setManualSelectionModalIsActive(false)}
      >
        <div>Please enter the worker ID and the worker owner:</div>
        <input
          value={nodeInfo.id}
          onChange={e =>
            setNodeInfo({ ...nodeInfo, id: transformToNumber(e.target.value) })
          }
          placeholder="Worker ID"
          className="focus:border-cb-green text-cb-gray-600 border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
        />
        <input
          value={nodeInfo.owner}
          onChange={e => setNodeInfo({ ...nodeInfo, owner: e.target.value })}
          placeholder="Worker Owner"
          className="focus:border-cb-green text-cb-gray-600 border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
        />
        <div className="flex gap-4">
          <Button
            type="button"
            selectable={false}
            variation="secondary"
            additionalClasses="w-full"
            onClick={() => setManualSelectionModalIsActive(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            selectable={false}
            variation="primary"
            additionalClasses="w-full"
            onClick={returnManualSelection}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    )
  }

  return (
    <>
      <div className="p-3 grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4 items-center justify-evenly text-lg text-cb-green absolute w-11/12 h-fit left-1/2 -translate-x-1/2 bottom-20 text-white rounded-lg bg-gray-300 bg-opacity-10 backdrop-blur-md shadow-glass-shadow">
        <div className="font-bold">{`Worker Location: ${node.location.latitude} ${node.location.longitude}`}</div>
        <div className="font-bold flex flex-col sm:flex-row">
          <div>Owner: </div>
          <TruncatedAddress address={node.owner} screenWidth={3000} />
        </div>
        <div className="font-bold">{`Distance to you: ${distance} kilometers`}</div>
        <Button
          type="button"
          selectable={false}
          variation={'secondary'}
          onClick={() => setManualSelectionModalIsActive(true)}
        >
          Select Manually
        </Button>
        <Button
          type="button"
          selectable={false}
          variation={'secondary'}
          onClick={returntoNearestNode}
        >
          Find Nearest
        </Button>
        {
          node.status.type === "Active"
          ?
          <Button
            type="button"
            selectable={false}
            variation={'primary'}
            additionalClasses="grid justify-center"
            onClick={() => onNavigate()}
          >
            <div className="flex gap-2">
              <div>Proceed</div>
              <TiArrowRight />
            </div>
          </Button>
          :
          <Button
            type="button"
            selectable={false}
            variation={'inactive'}
            additionalClasses="grid justify-center"
            // Disable this button in prod
            onClick={() => onNavigate()}
          >
            <div className="flex gap-2">
              <div>{`Miner is ${node.status.type.toLowerCase()}`}</div>
            </div>
          </Button>
        }
      </div>
      {manualSelectionModalIsActive ? (
        <ManualSelectionModal handleManualSelection={handleManualSelection} />
      ) : (
        <></>
      )}
    </>
  )
}

export default NodeInformationBar

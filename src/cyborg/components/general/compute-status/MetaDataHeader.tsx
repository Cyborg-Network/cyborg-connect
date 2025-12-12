import { FaCheck } from 'react-icons/fa6'
import { useUi } from '../../../context/UiContext'
import { truncateAddress } from '../../../util/truncateAddress'
import React, { ReactNode, useState } from 'react'
import useService from '../../../hooks/useService'
import comingsoon from '../../../../../public/assets/icons/comingsoon.svg'
import Button from '../buttons/Button'
import WarnConfirmModal from '../modals/WarnConfirm'
import useTransaction from '../../../api/parachain/useTransaction'
import { useParachain } from '../../../context/PapiContext'
import { Miner } from '../../../api/parachain/useWorkersQuery'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../../index'
import ManageKeypairs from '../../accessCompute/modals/ManageKeypairs'

interface MetaDataHeaderProps {
  owner: string
  id: Miner["id"]
  taskId: bigint
  domain: Miner["api"]
  status: Miner["oracle_status"]
  lastCheck: number
  taskPubKeyDeposited: boolean
  depositContainerKey: (pubkey: string, task_id: string) => void
  createContainerKeyPair: (task_id: string) => void
}

const FlexContainer: React.FC<{ children: ReactNode }> = ({
  children,
}: {
  children: ReactNode
}) => {
  return <div className="flex items-center gap-1">{children}</div>
}

const STATUS_STYLES = {
  Online: {
    bg: "bg-green-400",
    border: "border-green-500",
    dot: "bg-green-500",
  },
  Busy: {
    bg: "bg-red-400",
    border: "border-red-500",
    dot: "bg-red-500",
  },
  Inactive: {
    bg: "bg-gray-400",
    border: "border-gray-500",
    dot: "bg-gray-500",
  },
  Suspended: {
    bg: "bg-gray-400",
    border: "border-gray-500",
    dot: "bg-gray-500",
  },
} as const

export const MetaDataHeader: React.FC<MetaDataHeaderProps> = ({
  owner,
  id,
  taskId,
  domain,
  status,
  lastCheck,
  taskPubKeyDeposited,
  depositContainerKey,
  createContainerKeyPair
}: MetaDataHeaderProps) => {

  console.log(status.type)

  const styles = STATUS_STYLES[status.type]

  const { sidebarIsActive } = useUi()
  const { service } = useService()
  const { parachainApi, account } = useParachain()
  const { handleTransaction, isLoading } = useTransaction()

  const navigate = useNavigate()

  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [keypairModalVisible, setKeypairModalVisible] = useState(false)

  const navigateToDashboard = () => {
    navigate(ROUTES.DASHBOARD)
  }

  const stopTask = async (taskId: bigint) => {
    const tx = parachainApi.tx.TaskManagement.stop_task_and_vacate_miner(
      {task_id: taskId}
    )

    setConfirmModalVisible(false)

    await handleTransaction({
      tx,
      account,
      txName: "Stop Task",
      onSuccessFn: navigateToDashboard
    })
  }

  const showManageKeypairModal = () => {
    setConfirmModalVisible(false)
    setKeypairModalVisible(true)
  }

  const showConfirmModal = () => {
    setKeypairModalVisible(false)
    setConfirmModalVisible(true)
  }

  return (
    <>
    <div
      className={`ml-0 ${
        sidebarIsActive ? 'md:ml-0' : 'md:ml-6'
      } transition-all duration-500 ease-in-out grid gap-2 justify-end md:flex md:justify-between`}
    >
      <div className="flex text-white gap-3 flex-row-reverse md:flex-row flex-nowrap items-center">
        <div className="rounded-md h-24 aspect-square p-3 flex items-center justify-center">
          <img src={ service ? service.icon : comingsoon } />
        </div>
        <div className="justify-end md:justify-start flex flex-col gap-1">
          <div className="text-xl font-bold text-right md:text-left">
            { service ? service.name : 'Neuro ZK' }
          </div>
          <div className="text-nowrap flex gap-1">
            RPC Node |
            <span>
              <FlexContainer>
                {status.type}
                <FaCheck />
              </FlexContainer>
            </span>
          </div>
        </div>
      </div>
      <div className="grid gap-2 text-right justify-end md:items-center items-end mx-2 text-white">
        <div className="flex items-center gap-2 lg:text-xl justify-end">
          <div className="text-lg">Node Name: </div>
          <div className="text-cb-green">{id}</div>
        </div>
        <div className="flex flex-col-reverse items-end justify-end md:flex-row md:items-center gap-3 text-lg">
          <Button
            type="button"
            variation="primary"
            selectable={false}
            onClick={ () => showManageKeypairModal() }
          >
            <div className='flex gap-2'>
              <div>Manage Keypairs</div>
            </div>
          </Button>
          <Button
            type="button"
            variation="warning"
            selectable={false}
            onClick={ () => showConfirmModal() }
          >
            Stop Task
          </Button>
          <div className="text-opacity-50 text-white">
            Domain:{' '}
            <span className="text-white text-opacity-100">
              {domain.asText()}
            </span>
          </div>
          <div className="bg-cb-gray-600 w-fit text-md rounded-full text-white">
            <div className={`h-full w-fit rounded-full border ${styles.bg} ${styles.border} bg-opacity-15 flex  gap-2 py-1 px-3 items-center`}>
              <div className={`h-3 aspect-square rounded-full ${styles.dot}`}/>
              <div>{`${status.type}, Last Check: ${lastCheck}`}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {
      confirmModalVisible
      ?
      <WarnConfirmModal
        text="Are you sure that you want to stop running inference on the loaded model? The model will be removed from the miner, and the miner will be released for other users."
        onClick={() => stopTask(taskId)}
        isLoading={isLoading}
        onCancel={() => {setConfirmModalVisible(false)}}
      />
      :
      <></>
    }
    {
      keypairModalVisible
      ?
      <ManageKeypairs
        task_id={taskId.toString()}
        depositContainerKey={depositContainerKey}
        createContainerKeypair={createContainerKeyPair}
        onCancel={() => {setKeypairModalVisible(false)}}
      />
      :
      <></>
    }
    </>
  )
}

export default MetaDataHeader

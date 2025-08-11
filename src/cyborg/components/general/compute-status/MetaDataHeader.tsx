import { FaRegClock } from 'react-icons/fa6'
import { FaCheck } from 'react-icons/fa6'
import { useUi } from '../../../context/UiContext'
import { truncateAddress } from '../../../util/truncateAddress'
import React, { ReactNode, useState } from 'react'
import useService from '../../../hooks/useService'
import comingsoon from '../../../../../public/assets/icons/comingsoon.svg'
import Button from '../buttons/Button'
import WarnConfirmModal from '../modals/WarnConfirm'
import toast from 'react-hot-toast'
import useTransaction from '../../../api/parachain/useTransaction'
import { useSubstrateState } from '../../../../substrate-lib'

interface MetaDataHeaderProps {
  owner: string
  id: number
  taskId: number
  domain: string
  status: string
  lastCheck: number
}

const FlexContainer: React.FC<{ children: ReactNode }> = ({
  children,
}: {
  children: ReactNode
}) => {
  return <div className="flex items-center gap-1">{children}</div>
}

export const MetaDataHeader: React.FC<MetaDataHeaderProps> = ({
  owner,
  id,
  taskId,
  domain,
  status,
  lastCheck,
}: MetaDataHeaderProps) => {
  const isOnline = status === 'Active' || status === 'busy' ? true : false
  const isBusy = status === 'Inactive' || status !== 'active' ? true : false

  const { sidebarIsActive } = useUi()
  const { service } = useService()
  const { api, currentAccount } = useSubstrateState()
  const { handleTransaction, isLoading } = useTransaction(api)

  const [confirmModalVisible, setConfirmModalVisible] = useState(false)

  const stopTask = async (taskId: number) => {
    const tx = api.tx.taskManagement.stopTaskAndVacateMiner(
      taskId
    )

    await handleTransaction({
      tx,
      account: currentAccount,
      onSuccess: events => {
        console.log('Proof sucessfully requested!', events);
      },
      onError: error => toast('Transaction Failed:', error),
    })
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
              {!isBusy ? (
                <FlexContainer>
                  Available
                  <FaCheck />
                </FlexContainer>
              ) : (
                <FlexContainer>
                  Busy <FaRegClock />
                </FlexContainer>
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="grid gap-2 text-right justify-end md:items-center items-end mx-2 text-white">
        <div className="flex items-center gap-2 lg:text-xl justify-end">
          <div className="text-lg">Node Name: </div>
          <div className="text-cb-green">
            {truncateAddress(owner, 600)}:{id}
          </div>
        </div>
        <div className="flex flex-col-reverse items-end justify-end md:flex-row md:items-center gap-3 text-lg">
          <Button
            type="button"
            variation="warning"
            selectable={false}
            onClick={() => {setConfirmModalVisible(true)}}
          >
            Stop Task
          </Button>
          <div className="text-opacity-50 text-white">
            IP Address:{' '}
            <span className="text-white text-opacity-100">
              {/*{domain}*/ '16.171.249.42'}
            </span>
          </div>
          <div className="bg-cb-gray-600 w-fit text-md rounded-full text-white">
            <div
              className={`h-full w-fit rounded-full border ${
                isOnline
                  ? 'bg-green-400 border-green-500'
                  : 'bg-red-500 border-red-500'
              }  bg-opacity-15 flex  gap-2 py-1 px-3 items-center`}
            >
              <div
                className={`h-3 aspect-square rounded-full ${
                  isOnline ? 'bg-green-500' : 'bg-red-500'
                } `}
              />
              <div>{`${
                isOnline ? 'Online' : 'Offline'
              }, Last Check: ${lastCheck}`}</div>
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
    </>
  )
}

export default MetaDataHeader

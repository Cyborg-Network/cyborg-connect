import React, { ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../../index'
import cyberdock from '../../../../../public/assets/icons/cyberdock.svg'
import { Separator } from '../Separator'
import { FaRegTrashAlt } from 'react-icons/fa'
import RemoveNodeModal from '../../provideCompute/modals/RemoveNode'
import { TaskId } from '../../../types/task'
import { UserMiner } from '../../../api/parachain/useWorkersQuery'
import { MinerReactRouterState } from '../../../types/miner'

interface Props {
  item: UserMiner
  lastTask: TaskId
  isProvider: boolean
}

const NodeCard: React.FC<Props> = ({ item, lastTask, isProvider }: Props) => {
  const navigate = useNavigate()

  const [removeNodeModalIsActive, setRemoveNodeModalIsActive] = useState(false)

  interface LiProps {
    children: ReactNode
    additionalClasses?: String
  }

  //li with exactly these specs needed a lot here, sets parent up for responsiveness
  const LI = ({ children, additionalClasses }: LiProps) => (
    <li className={`w-full flex justify-between ${additionalClasses}`}>
      {children}
    </li>
  )

  const navigateToComputeScreen = () => {
    const minerName = item.api.asText().replace(/^https?:\/\//, '');

    //Semi Typesafety for react router
    const minerReactRouterState: MinerReactRouterState = { id: item.id, owner: item.owner }
    navigate(`${ROUTES.COMPUTE_STATUS}/${minerName}`, {
      state: minerReactRouterState,
    })
  }

  //span with exactly these specs needed a lot here, sets parent up for responsiveness
  const SPAN = ({ children, additionalClasses }) => <span className={`lg:hidden ${additionalClasses}`}>{children}</span>

  return (
    <>
      <div
        onClick={() => navigateToComputeScreen()}
        className={`hover:text-color-foreground hover:font-bold hover:cursor-pointer rounded-lg lg:rounded-none relative text-color-text-2`}
      >
        <div className="lg:w-full items-center py-4 px-5 bg-color-background-4 rounded-lg h-22">
          <ul className="w-full flex flex-col gap-2 items-center lg:grid lg:gap-0 lg:grid-cols-4 lg:grid-rows-1">
            <li className="flex items-center gap-3]">
              <img className='h-3/4' src={cyberdock} />
              <button className="pl-3 flex flex-col items-start">
                <p className="mt-0 text-lg lg:text-sm text-color-text-2">
                  ID: {item.id}
                </p>
              </button>
            </li>
            <LI>
              <SPAN additionalClasses='text-color-text-2'>Type:</SPAN>
              <span className='text-color-text-2'>Providers</span>
            </LI>
            <Separator
              colorClass={'bg-gray-500'}
              additionalStyles={'lg:hidden'}
            />
            <LI>
              <SPAN additionalClasses='text-color-text-2'>IP / URL:</SPAN>
              <span className='text-color-text-2'>{`${item.api.asText()}`}</span>
            </LI>
            <Separator
              colorClass={'bg-gray-500'}
              additionalStyles={'lg:hidden'}
            />
            <LI
              additionalClasses={`flex gap-2 ${
                item.oracle_status ? 'text-color-foreground' : 'text-red-600'
              }`}
            >
              <SPAN additionalClasses="text-color-text-2">Status:</SPAN>
              <span className="flex gap-2 text-color-text-2">
                {item.lastTask ? `taskId: ${item.lastTask}` : 'Active'}
                <p
                  className={`font-bold ${
                    lastTask === item.lastTask
                      ? 'right-2 top-2 text-white'
                      : 'hidden'
                  }`}
                >
                  Task Executing...
                </p>
              </span>
            </LI>
            {isProvider ? (
              <div
                className="absolute text-gray-400 top-4 right-4 lg:right-12 lg:top-1/2 lg:-translate-y-1/2 hover:text-red-800"
                onClick={() => {
                  setRemoveNodeModalIsActive(true)
                  console.log(item)
                }}
              >
                <FaRegTrashAlt size={20} />
              </div>
            ) : (
              <></>
            )}
          </ul>
        </div>
      </div>
      {removeNodeModalIsActive ? (
        <RemoveNodeModal
          nodeInfo={{ id: item.id, workerType: "executable" }}
          onCancel={() => setRemoveNodeModalIsActive(false)}
        />
      ) : (
        <></>
      )}
    </>
  )
}

export default NodeCard

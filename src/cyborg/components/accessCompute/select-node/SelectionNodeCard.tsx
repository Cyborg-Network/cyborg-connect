import { Separator } from '../../general/Separator'
import { FaCheck } from 'react-icons/fa6'
import Button from '../../general/buttons/Button'
import server from '../../../../../public/assets/icons/server.svg'
import { usePriceQuery } from '../../../api/parachain/usePriceQuery'
import React, { useEffect, useState } from 'react'
import { Miner, useWorkersQuery } from '../../../api/parachain/useWorkersQuery'
import useService from '../../../hooks/useService'
import { MinerReactRouterStateWithLocation } from '../../../types/miner'

interface Props {
  nodeId: MinerReactRouterStateWithLocation["selectedNodeId"]
  onClick: () => void
  isSelected: boolean
}

const SelectionNodeCard: React.FC<Props> = ({
  nodeId,
  onClick,
  isSelected,
}: Props) => {

  const [worker, setWorker] = useState<Miner | null>(null);

  const {
    data: computeHourPrice,
    //isLoading: computeHourPriceIsLoading,
    //error: computeHourPriceError
  } = usePriceQuery()

  const { service } = useService()
  const {
    data: workers,
    //isLoading: workersIsLoading,
    //error: workersError
  } = useWorkersQuery(service)

  // TODO: ugly workaround until the attestation based approach is implemented
  useEffect(() => {
    if(workers) {
      let current = workers.filter(w => (w.id === nodeId))
      setWorker(current[0]);
    }
  }, [workers])

  return (
    <Button
      type="button"
      additionalClasses={'px-10 py-10 relative flex items-start rounded-xl'}
      variation="secondary"
      selectable={{ isSelected: isSelected }}
      onClick={() => onClick()}
    >
      <div
        className={`absolute h-8 grid justify-center items-center rounded-full aspect-square top-4 right-4 border border-cb-gray-400 text-white ${
          isSelected ? 'bg-cb-green' : 'bg-cb-gray-700'
        }`}
      >
        {isSelected ? <FaCheck /> : <></>}
      </div>
      <div className="flex py-3 flex-col gap-6 w-full">
        <div className="flex gap-3 items-center justify-start mr-9">
          <div className="bg-cb-gray-400 rounded-full p-2 sm:p-4 h-10 w-10 sm:h-16 sm:w-16 grid items-center justify-center">
            <img src={server} />
          </div>
          <div className="flex flex-col justify-center items-start">
            <div className="font-bold text-lg whitespace-nowrap overflow-hidden text-ellipsis">
              {'Cyborg Miner'}
            </div>
            <div className="flex gap-2">
              <div className="text-xl font-bold text-white">
                {`${computeHourPrice}`}
                <span className="text-gray-400 text-base">ENTT</span>
              </div>
              <div className="bg-white rounded-lg px-1 py-0.5 text-cb-gray-700 text-xs h-fit w-fit self-center">
                HOURLY
              </div>
            </div>
          </div>
        </div>
        <Separator colorClass="bg-cb-gray-400" />
        <div className="grid grid-cols-4 gap-4">
          <div className="text-left">
            <div className="text-gray-500 text-sm">{'CPU'}</div>
            <div className="text-gray-400 text-sm">
              {
              worker && worker.specs && worker.specs.cpu
              ? 
                `${worker.specs.cpu} Cores`
              : 
                "Loading"
              }
            </div>
          </div>
          <div className="text-left">
            <div className="text-gray-500 text-sm">{'Storage'}</div>
            <div className="text-gray-400 text-sm">
              {
              worker && worker.specs && worker.specs.storage
              ?
                `${(worker.specs.storage / 1024n / 1024n / 1024n)} GB`
              :
                "Loading"
              }
            </div>
          </div>
          <div className="text-left">
            <div className="text-gray-500 text-sm">{'Memory'}</div>
            <div className="text-gray-400 text-sm">
              {
              worker && worker.specs && worker.specs.ram
              ?
                `${(worker.specs.ram / 1024n / 1024n / 1024n)} GB`
              :
              "Loading"
              }
            </div>
          </div>
        </div>
      </div>
    </Button>
  )
}

export default SelectionNodeCard

import React, { useEffect, useState } from 'react'
import Button from '../../general/buttons/Button'
import { toast } from 'react-hot-toast'
import { TiArrowRight } from 'react-icons/ti'
import PaymentModal from '../modals/Payment'
import SimpleTaskUpload from '../modals/SimpleTaskUpload'
import haversineDistance from 'haversine-distance'
import { useLocation } from 'react-router-dom'
import { DEPLOY_STATUS, useCyborgState } from '../../../CyborgContext'
import LoadingModal from '../../general/modals/Loading'
import SelectionNodeCard from './SelectionNodeCard'
import { useWorkersQuery } from '../../../api/parachain/useWorkersQuery'
import useService, { SERVICES } from '../../../hooks/useService'
import { useUserComputeHoursQuery } from '../../../api/parachain/useUserSubscription'
import FlashInferUpload from '../modals/FlashInferUpload'
import { MinerReactRouterStateWithLocation } from '../../../types/miner'
import CyCloudTaskDeployment from '../modals/CyCloudTaskDeployment'

const DEPLOYMENT_STAGES = {
  INIT: 'INIT',
  PAYMENT: 'PAYMENT',
  DEPLOYMENT: 'DEPLOMENT',
  PENDING: 'PENDING',
}

const SelectNodePage: React.FC = () => {
  const { serviceStatus } = useCyborgState()
  const { service } = useService()

  const location = useLocation()

  const { userLocation, selectedNodeId } = (location.state as MinerReactRouterStateWithLocation) || {}

  const {
    data: workers,
    //isLoading: workersIsLoading,
    //error: workersError
  } = useWorkersQuery(service)

  const {
    data: userComputeHours,
    //isLoading: userComputeHoursIsLoading,
    //error: userComputeHoursError 
  } = useUserComputeHoursQuery();

  const [nearbyNodes, setNearbyNodes] = useState<MinerReactRouterStateWithLocation['selectedNodeId'][]>([])
  const [selectedNodes, setSelectedNodes] = useState<MinerReactRouterStateWithLocation['selectedNodeId'][]>([])
  const [deploymentStage, setDeploymentStage] = useState(DEPLOYMENT_STAGES.INIT)

  useEffect(() => {
    if (selectedNodeId)
      setSelectedNodes(prev => {
        const exists = prev.some(
          n => n === selectedNodeId
        )
        return exists ? prev : [selectedNodeId, ...prev]
      })
  }, [selectedNodeId])

  useEffect(() => {
    console.log(selectedNodes)
  }, [selectedNodes])

  //TODO: This is another thing that should be fixed from the parachain side, perhaps with geohashes
  useEffect(() => {
    const getOtherNearbyNodes = () => {
      const fourNearest = []

      if (selectedNodeId) {
        fourNearest.push(selectedNodeId)
      }

      const userLoc = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      }

      workers.forEach(currentNode => {
        if (fourNearest.length < 4 && currentNode.id !== selectedNodeId.id) {
          fourNearest.push(currentNode)
          return
        }

        const nodeLoc = {
          latitude: currentNode.location.latitude,
          longitude: currentNode.location.longitude,
        }

        const currentHaversine = haversineDistance(userLoc, nodeLoc)

        fourNearest.forEach((currentNearest, index) => {
          if (currentNode.id !== selectedNodeId.id) {
            fourNearest[index] = {
              ...currentNode,
              haversine: currentHaversine,
            }
            return
          }
          if (
            currentHaversine < currentNearest.haversine &&
            currentNode.id !== currentNearest.id &&
            currentNode.id !== selectedNodeId.id
          ) {
            fourNearest[index] = currentNode
          }
        })
      })
      setNearbyNodes(fourNearest)
    }
    if (userLocation && workers) getOtherNearbyNodes()
  }, [workers, userLocation, selectedNodeId])

  const startTransaction = () => {
    setDeploymentStage(DEPLOYMENT_STAGES.PAYMENT)
  }

  const setDeploymentStageToInit = () => {
    setDeploymentStage(DEPLOYMENT_STAGES.INIT)
  }

  const deploy = () => {
    if (selectedNodes.length <= 0) {
      toast('Please select at least one server!')
      return
    }

    setDeploymentStage(DEPLOYMENT_STAGES.DEPLOYMENT)
  }

  

  const toggleNodeSelection = combinedId => {
    const index = selectedNodes.findIndex(item => {
      return combinedId.id === item
    })
    if (index === -1) {
      setSelectedNodes([...selectedNodes, combinedId])
    } else {
      setSelectedNodes([
        ...selectedNodes.slice(0, index),
        ...selectedNodes.slice(index + 1),
      ])
    }
  }

  return (
    <div className="h-screen w-screen grid">
      <div className="text-white bg-transparent p-0 flex flex-col gap-4 2xl:w-2/5 xl:w-3/5 lg:w-4/6 sm:w-4/5 w-11/12 self-center justify-self-center my-24">
        <div className="flex justify-between bg-cb-gray-600 p-3 sm:p-8 rounded-lg">
          <div className="flex justify-between w-full">
            <div className='flex gap-2'>
              <div className="w-16 h-16 p-2 rounded-full bg-cb-gray-500">
                <img
                  className="h-full aspect-square"
                  alt="Service"
                  src={service.icon}
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="font-bold text-xl">{service.name}</div>
                <div className="text-cb-green text-lg">Cyborg Miner</div>
              </div>
            </div>
            <div className='flex flex-col justify-end'>
              <div className='text-lg'>Hours left in subscription: {userComputeHours}</div>
              <Button
                type="button"
                selectable={false}
                onClick={startTransaction}
                variation='primary'
                additionalClasses="flex justify-center"
              >
                <div className="flex items-center gap-2">
                  <div>Top Up</div>
                  <TiArrowRight />
                </div>
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-cb-gray-600 rounded-lg p-6 sm:p-16 flex flex-col gap-10 items-center">
          <div className="relative">
            <div className="text-4xl">Other Nearby Nodes</div>
            <div className="absolute left-full bottom-0 text-cb-green w-full ml-2">{`${selectedNodes.length} Selected`}</div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {nearbyNodes.map(node => (
              <SelectionNodeCard
                nodeId={node}
                key={node.toString()}
                onClick={() =>
                  toggleNodeSelection({ id: node })
                }
                isSelected={selectedNodes.some(combinedId => {
                  return (combinedId === node)
                })}
              />
            ))}
          </div>
          <div className="flex justify-center gap-4 w-full">
            <Button
              type="button"
              selectable={false}
              onClick={deploy}
              variation="primary"
            >
              <div className="flex items-center gap-2">
                <div>Deploy</div>
                <TiArrowRight />
              </div>
            </Button>
          </div>
        </div>
      </div>
      {deploymentStage === DEPLOYMENT_STAGES.PAYMENT ? (
        <PaymentModal
          setService={() => {}}
          onCancel={setDeploymentStageToInit}
          onConfirm={setDeploymentStageToInit}
        />
      ) : (
        <></>
      )}
      {deploymentStage === DEPLOYMENT_STAGES.DEPLOYMENT &&
      service.id === SERVICES.OI.id ? (
        <SimpleTaskUpload
          setService={() => {}}
          onCancel={setDeploymentStageToInit}
          nodes={selectedNodes}
        />
      ) : (
        <></>
      )}
      {deploymentStage === DEPLOYMENT_STAGES.DEPLOYMENT &&
      service.id === SERVICES.CYCL.id ? (
        <CyCloudTaskDeployment
          setService={() => {}}
          onCancel={setDeploymentStageToInit}
          nodes={selectedNodes[0]}
        />
      ) : (
        <></>
      )}
      {deploymentStage === DEPLOYMENT_STAGES.DEPLOYMENT &&
      service.id === SERVICES.FI.id ? (
        <FlashInferUpload
          setService={() => {}}
          onCancel={setDeploymentStageToInit}
          nodes={selectedNodes}
        />
      ) : (
        <></>
      )}
      {serviceStatus.deployTask === DEPLOY_STATUS.PENDING ? (
        <LoadingModal text={'Deploying your Model!'} />
      ) : (
        <></>
      )}
    </div>
  )
}

export default SelectNodePage

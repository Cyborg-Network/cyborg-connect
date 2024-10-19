import cyberiot from '../../../../../public/assets/icons/cyber-iot.svg'
import React, { useEffect, useState } from 'react'
import Button from '../../general/buttons/Button'
import { toast } from 'react-hot-toast'
import { TiArrowRight } from 'react-icons/ti'
import PaymentModal from './../modals/Payment'
import UploadDockerImgURL from './../modals/UploadDockerImgURL'
import haversineDistance from 'haversine-distance'
import { useLocation } from 'react-router-dom'
import {
  useCyborg,
  DEPLOY_STATUS,
  useCyborgState,
} from '../../../CyborgContext'
import LoadingModal from '../../general/modals/Loading'
import SelectionNodeCard from './SelectionNodeCard'

const DEPLOYMENT_STAGES = {
  INIT: 'INIT',
  PAYMENT: 'PAYMENT',
  DEPLOYMENT: 'DEPLOMENT',
  PENDING: 'PENDING',
}

function SelectNodePage() {
  const { workersWithLastTasks } = useCyborg()
  const { serviceStatus } = useCyborgState()

  const location = useLocation()

  const { userLocation, preSelectedNode } = location.state || {}

  const [nearbyNodes, setNearbyNodes] = useState([])
  const [selectedNodes, setSelectedNodes] = useState([])
  const [deploymentStage, setDeploymentStage] = useState(DEPLOYMENT_STAGES.INIT)

  useEffect(() => {
    if (preSelectedNode)
      setSelectedNodes([
        { owner: preSelectedNode.owner, id: preSelectedNode.id },
        ...selectedNodes,
      ])
  }, [])

  useEffect(() => {
    const getOtherNearbyNodes = () => {
      const fourNearest = []

      if (preSelectedNode) {
        fourNearest.push(preSelectedNode)
      }

      const userLoc = {
        latitude: userLocation.lat,
        longitude: userLocation.lon,
      }

      workersWithLastTasks.forEach(currentNode => {
        if (fourNearest.length < 4 && currentNode.id !== preSelectedNode.id) {
          fourNearest.push(currentNode)
          return
        }

        const nodeLoc = {
          latitude: currentNode.location.latitude,
          longitude: currentNode.location.longitude,
        }

        const currentHaversine = haversineDistance(userLoc, nodeLoc)

        fourNearest.forEach((currentNearest, index) => {
          if (currentNode.id !== preSelectedNode.id) {
            fourNearest[index] = {
              ...currentNode,
              ['haversine']: currentHaversine,
            }
            return
          }
          if (
            currentHaversine < currentNearest.haversine &&
            currentNode.id !== currentNearest.id &&
            currentNode.id !== preSelectedNode.id
          ) {
            fourNearest[index] = currentNode
          }
        })
      })
      setNearbyNodes(fourNearest)
    }
    if (userLocation && workersWithLastTasks) getOtherNearbyNodes()
  }, [workersWithLastTasks, userLocation])

  const startTransaction = () => {
    if (selectedNodes.length <= 0) {
      toast('Please select at least one server!')
      return
    }

    setDeploymentStage(DEPLOYMENT_STAGES.PAYMENT)
  }

  const cancelTransaction = () => {
    setDeploymentStage(DEPLOYMENT_STAGES.INIT)
  }

  const confirmPaymentMethod = () => {
    setDeploymentStage(DEPLOYMENT_STAGES.DEPLOYMENT)
  }

  const toggleNodeSelection = combinedId => {
    const index = selectedNodes.findIndex(item => {
      return combinedId.owner === item.owner && combinedId.id === item.id
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
    <>
      <div className="text-white bg-transparent p-0 flex flex-col gap-4 2xl:w-full xl:w-4/5 lg:w-5/6 sm:w-4/5 w-11/12 self-center justify-self-center my-24">
        <div className="flex justify-between bg-cb-gray-600 p-3 sm:p-8 rounded-lg">
          <div className="flex gap-2">
            <img className="w-16 h-16 items-center" src={cyberiot} />
            <div className="flex flex-col justify-center">
              <div className="font-bold text-xl">Cyber Dock</div>
              <div className="text-cb-green text-lg">Zigbee</div>
            </div>
          </div>
        </div>
        <div className="bg-cb-gray-600 rounded-lg p-6 sm:p-16 flex flex-col gap-10 items-center">
          <div className="relative">
            <div className="text-4xl">Other Nearby Nodes</div>
            <div className="absolute left-full bottom-0 text-cb-green w-full ml-2">{`${selectedNodes.length} Selected`}</div>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {nearbyNodes.map(node => (
              <SelectionNodeCard
                node={node}
                onClick={() =>
                  toggleNodeSelection({ owner: node.owner, id: node.id })
                }
                isSelected={selectedNodes.some(combinedId => {
                  return (
                    combinedId.owner === node.owner && combinedId.id === node.id
                  )
                })}
              />
            ))}
          </div>
          <Button onClick={startTransaction} variation="primary">
            <div className="flex items-center gap-2">
              <div>Select Payment Method</div>
              <TiArrowRight />
            </div>
          </Button>
        </div>
      </div>
      {deploymentStage === DEPLOYMENT_STAGES.PAYMENT ? (
        <PaymentModal
          onCancel={cancelTransaction}
          onConfirm={confirmPaymentMethod}
          //get rid of that
          nodeIds={selectedNodes}
        />
      ) : (
        <></>
      )}
      {deploymentStage === DEPLOYMENT_STAGES.DEPLOYMENT ? (
        <UploadDockerImgURL
          onCancel={cancelTransaction}
          nodeIds={selectedNodes}
        />
      ) : (
        <></>
      )}
      {serviceStatus.deployTask === DEPLOY_STATUS.PENDING ? (
        <LoadingModal text={'Deploying your container securely!'} />
      ) : (
        <></>
      )}
    </>
  )
}

export default SelectNodePage

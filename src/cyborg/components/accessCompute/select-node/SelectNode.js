import React, { useEffect, useState } from 'react'
import Button from '../../general/buttons/Button'
import { toast } from 'react-hot-toast'
import { TiArrowRight } from 'react-icons/ti'
import PaymentModal from './../modals/Payment'
import SimpleTaskUpload from './../modals/SimpleTaskUpload'
import haversineDistance from 'haversine-distance'
import { useLocation } from 'react-router-dom'
import {
  useCyborg,
  DEPLOY_STATUS,
  useCyborgState,
  SERVICES,
} from '../../../CyborgContext'
import LoadingModal from '../../general/modals/Loading'
import SelectionNodeCard from './SelectionNodeCard'
import useService from '../../../hooks/useService'
import { returnCorrectWorkers } from '../../../util/returnCorrectWorkers'
//import NeuroZkUpload from '../modals/NeuroZKUpload'

const DEPLOYMENT_STAGES = {
  INIT: 'INIT',
  PAYMENT: 'PAYMENT',
  DEPLOYMENT: 'DEPLOMENT',
  PENDING: 'PENDING',
}

function SelectNodePage() {
  const service = useService();
  const workersWithLastTasks = returnCorrectWorkers(useCyborg().workersWithLastTasks, service);
  const { serviceStatus } = useCyborgState()

  const location = useLocation()

  const { userLocation, preSelectedNode } = location.state || {}

  const [nearbyNodes, setNearbyNodes] = useState([])
  const [selectedNodes, setSelectedNodes] = useState([])
  const [deploymentStage, setDeploymentStage] = useState(DEPLOYMENT_STAGES.INIT)
  const [hoursSelected, setHoursSelected] = useState(0)

  useEffect(() => {
    if (preSelectedNode)
      setSelectedNodes([
        { owner: preSelectedNode.owner, id: preSelectedNode.id },
        ...selectedNodes,
      ])
  }, [])

  useEffect(() => {
    console.log(selectedNodes);
  }, [selectedNodes])

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

    if(!isPositiveInteger(hoursSelected)){
      toast('Please select a valid number of hours (positive integer)');
      return
    }

    setDeploymentStage(DEPLOYMENT_STAGES.PAYMENT)
  }

  function isPositiveInteger(input) {
    const positiveIntegerPattern = /^[1-9]\d*$/;
    return positiveIntegerPattern.test(input);
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
    <div className='h-screen w-screen grid'>
      <div className="text-white bg-transparent p-0 flex flex-col gap-4 2xl:w-2/5 xl:w-3/5 lg:w-4/6 sm:w-4/5 w-11/12 self-center justify-self-center my-24">
        <div className="flex justify-between bg-cb-gray-600 p-3 sm:p-8 rounded-lg">
          <div className="flex gap-2">
            <div className='w-16 h-16 p-2 rounded-full bg-cb-gray-500'>
              <img className='h-full aspect-square' src={service.icon} />
            </div>
            <div className="flex flex-col justify-center">
              <div className="font-bold text-xl">{service.name}</div>
              <div className="text-cb-green text-lg">Cyborg Miner</div>
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
          <div className='text-2xl self-start'>Purchase Compute Hours</div>
          <div className='flex gap-4 w-full'>
          <input
              type='text'
              className="bg-cb-gray-700 text-white border border-gray-600 focus:border-cb-green focus:outline-none p-2 rounded w-16 sm:w-auto"
              placeholder='Number of Hours'
              onChange={e => setHoursSelected(e.target.value)}
          />
          <Button onClick={startTransaction} variation="primary">
            <div className="flex items-center gap-2">
              <div>Select Payment Method</div>
              <TiArrowRight />
            </div>
          </Button>
          </div>
        </div>
      </div>
      {deploymentStage === DEPLOYMENT_STAGES.PAYMENT ? (
        <PaymentModal
          onCancel={cancelTransaction}
          onConfirm={confirmPaymentMethod}
          hoursSelected={Number(hoursSelected)}
          //get rid of that
          nodeIds={selectedNodes}
        />
      ) : (
        <></>
      )}
      {deploymentStage === DEPLOYMENT_STAGES.DEPLOYMENT && (service.id === SERVICES.CYBER_DOCK.id || service.id === SERVICES.EXECUTABLE.id) ? (
        <SimpleTaskUpload
          onCancel={cancelTransaction}
          nodes={selectedNodes}
        />
      ) : (
        <></>
      )}
      {/*
      {deploymentStage === DEPLOYMENT_STAGES.DEPLOYMENT && service.id === SERVICES.NEURO_ZK.id
        ? <NeuroZkUpload
            onCancel={cancelTransaction}
            nodes={selectedNodes}
          />
          :
        <></>
      }
      */}
      {serviceStatus.deployTask === DEPLOY_STATUS.PENDING ? (
        <LoadingModal text={'Deploying and executing your ZK Task!'} />
      ) : (
        <></>
      )}
    </div>
  )
}

export default SelectNodePage

import Map from './Map'
import React, { useState, useEffect } from 'react'
import haversineDistance from 'haversine-distance'
import MapHeader from './MapHeader'
import NodeInformationBar from './NodeInformationBar'
import { toast } from 'react-hot-toast'
import Button from '../buttons/Button'
import Modal from '../modals/Modal'
import InfoBox from '../InfoBox'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../..'
import { useWorkersQuery } from '../../../api/parachain/useWorkersQuery'
import { Country, Location } from '../../../types/location'
import useService from '../../../hooks/useService'
const crg = require('country-reverse-geocoding').country_reverse_geocoding()

// At some point this will need an algo that calculates a favourable balance between distance, reputation and specs
// (specs will be interesting to user because there might be a willingness to pay more for a node with better reputation even though it may be more powerful than what is needed )

//TODO: Here again will proably be a better way to do this, but will depend on the parachain implementation (eg. geohashes)
const getNearestNode = (originLocation: Location, nodes: any[]) => {
  const currentNearest = { distance: null, node: null }

  nodes.forEach(node => {
    const distance = haversineDistance(
      {
        latitude: originLocation.latitude,
        longitude: originLocation.longitude,
      },
      { latitude: node.location.latitude, longitude: node.location.longitude }
    )

    if (!currentNearest.distance || distance < currentNearest.distance) {
      currentNearest.distance = distance
      currentNearest.node = node
    }
  })

  return { distance: currentNearest.distance, node: currentNearest.node }
}

const getNodeCountry = (node: any): Country => {
  return crg.get_country(node.location.latitude, node.location.longitude)
}

const MapInteractor: React.FC = () => {
  const navigate = useNavigate()

  const { service } = useService()
  console.log('MAP_INTERACTOR - service: ', service)
  const {
    data: workers,
    //isLoading: workersIsLoading,
    //error: workersError
  } = useWorkersQuery(service)

  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [selectedNode, setSelectedNode] = useState<any | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [nearestNode, setNearestNode] = useState<any | null>(null)
  const [userLocationInput, setUserLocationInput] = useState<Location | null>(
    null
  )

  const handleReturnToNearestNode = () => {
    setSelectedNode(nearestNode)
  }

  const handleSelectNode = (node: any) => {
    setSelectedNode({ ...node, country: getNodeCountry(node) })
  }

  const handleManualSelection = (id: number, owner: string) => {
    const node = workers.find(node => node.owner === owner && node.id === id)

    if (node) {
      setSelectedNode({ ...node, country: getNodeCountry(node) })
    } else {
      toast('This node does not exist')
    }
  }

  const getUserLocation = () => {
    const success = position => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    }

    const error = err => {
      switch (err.code) {
        case err.PERMISSION_DENIED:
          console.warn('User denied the request for Geolocation.')
          break
        case err.POSITION_UNAVAILABLE:
          toast(
            'Location information is unavailable, please enter your location manually.'
          )
          break
        case err.TIMEOUT:
          toast(
            'The request to get user location timed out, please enter your location manually.'
          )
          break
        case err.UNKNOWN_ERROR:
          toast(
            'An unknown error occurred, please enter your location manually.'
          )
          break
        default:
          toast(
            'An unknown error occurred, please enter your location manually.'
          )
      }
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(success, error)
    } else {
      toast(
        'Geolocation is not supported by your browser, please enter your location manually.'
      )
    }
  }

  useEffect(() => {
    if (userLocation && workers)
      if (workers.length > 0) {
        const nodeData = getNearestNode(userLocation, workers)

        setNearestNode({
          ...nodeData.node,
          country: getNodeCountry(nodeData.node),
        })
        handleSelectNode(nodeData.node)
        setDistance(nodeData.distance)
      }
  }, [userLocation, workers])

  useEffect(() => {
    if (selectedNode && userLocation) {
      const userLoc = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      }
      const nodeLocation = {
        latitude: selectedNode.location.latitude,
        longitude: selectedNode.location.longitude,
      }

      setDistance(Math.round(haversineDistance(userLoc, nodeLocation) / 1000))
    }
  }, [selectedNode, userLocation])

  const handleUserLocationInputChange = (type, value) => {
    setUserLocationInput({ ...userLocationInput, [`${type}`]: value })
  }

  //Fix this when TanstackRouter is implemented
  const navigateToNearestNodesSelection = () => {
    navigate(ROUTES.MODAL_NODES, {
      state: { userLocation: userLocation, preSelectedNode: selectedNode },
    })
  }

  const userInputIsPresent =
    userLocationInput &&
    userLocationInput.latitude &&
    userLocationInput.longitude

  return (
    <div className="w-screen h-screen">
      <div className="absolute h-5/6 w-5/6 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 overflow-hidden flex flex-col gap-5">
        {selectedNode && selectedNode.country ? (
          <MapHeader country={selectedNode.country} service={service} />
        ) : (
          <></>
        )}
        <div className="h-full rounded-lg bg-cb-gray-600">
          <Map
            nodes={workers}
            userCoordinates={userLocation}
            handleSelectNode={handleSelectNode}
            selectedNode={selectedNode}
          />
        </div>
        {selectedNode ? (
          <NodeInformationBar
            node={selectedNode}
            distance={distance}
            returntoNearestNode={handleReturnToNearestNode}
            onNavigate={navigateToNearestNodesSelection}
            handleManualSelection={handleManualSelection}
          />
        ) : (
          <></>
        )}
        {!userLocation ? (
          <Modal
            onOutsideClick={() => {}}
            additionalClasses="flex flex-col gap-3"
          >
            <div className="text-xl font-bold">Choose Location</div>
            <Button
              type="button"
              variation="primary"
              onClick={getUserLocation}
              selectable={false}
            >
              Allow Location Access
            </Button>
            <div className="font-bold self-center text-lg">or</div>
            <div className="flex gap-2">
              <div className="text-xl font-bold">Enter Manually</div>
              <InfoBox>
                <div>
                  If your device doesn't support automatic location access, you
                  can use navigation services (eg. Google Maps) on your phone
                  with GPS enabled, and then enter the location here manually.
                  In some cases this will also be more accurate than automatic
                  location access.
                </div>
              </InfoBox>
            </div>
            <div className="flex gap-2">
              <input
                className="w-full p-2 rounded-md text-black"
                type="text"
                placeholder="Latiitude"
                onChange={e =>
                  handleUserLocationInputChange('lat', e.target.value)
                }
              />
              <input
                className="w-full p-2 rounded-md text-black"
                type="text"
                placeholder="Longitude"
                onChange={e =>
                  handleUserLocationInputChange('lon', e.target.value)
                }
              />
            </div>
            <Button
              type="button"
              selectable={false}
              onClick={
                userInputIsPresent
                  ? () => setUserLocation(userLocationInput)
                  : () => {
                      return
                    }
              }
              variation={`${userInputIsPresent ? 'primary' : 'inactive'}`}
            >
              Confirm
            </Button>
          </Modal>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default MapInteractor

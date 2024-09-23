import Map from './Map'
import { useState, useEffect } from 'react'
import { nodes } from '../../../data/MockData'
import haversineDistance from 'haversine-distance'
import MapHeader from './MapHeader'
import NodeInformationBar from './NodeInformationBar'
import { toast } from 'react-hot-toast'
const crg = require('country-reverse-geocoding').country_reverse_geocoding()

// At some point this will need an algo that calculates a favourable balance between distance, reputation and specs
// (specs will be interesting to user because there might be a willingness to pay more for a node with better reputation even though it may be more powerful than what is needed )

const getNearestNode = (originLocation, nodes) => {
  const currentNearest = { distance: null, node: null }

  nodes.forEach(node => {
    const distance = haversineDistance(
      { latitude: originLocation.lat, longitude: originLocation.lon },
      { latitude: node.location.lat, longitude: node.location.lon }
    )

    if (!currentNearest.distance || distance < currentNearest.distance) {
      currentNearest.distance = distance
      currentNearest.node = node
    }
  })

  return { distance: currentNearest.distance, node: currentNearest.node }
}

const getNodeCountry = node => {
  return crg.get_country(node.location.lat, node.location.lon)
}

const MapInteractor = () => {
  const [userLocation, setUserLocation] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [distance, setDistance] = useState(null)
  const [nearestNode, setNearestNode] = useState(null)

  const handleReturnToNearestNode = () => {
    setSelectedNode(nearestNode)
  }

  const handleSelectNode = node => {
    setSelectedNode({ ...node, ['country']: getNodeCountry(node) })
  }

  useEffect(() => {
    const success = position => {
      setUserLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
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
      }
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(success, error)
    } else {
      toast(
        'Geolocation is not supported by your browser, please enter your location manually.'
      )
    }
  }, [])

  useEffect(() => {
    if (userLocation && nodes) {
      const nodeData = getNearestNode(userLocation, nodes)

      setNearestNode({
        ...nodeData.node,
        ['country']: getNodeCountry(nodeData.node),
      })
      handleSelectNode(nodeData.node)
      setDistance(nodeData.distance)
    }
  }, [userLocation])

  useEffect(() => {
    if (selectedNode && userLocation) {
      const userLoc = {
        latitude: userLocation.lat,
        longitude: userLocation.lon,
      }
      const nodeLocation = {
        latitude: selectedNode.location.lat,
        longitude: selectedNode.location.lon,
      }

      setDistance(Math.round(haversineDistance(userLoc, nodeLocation) / 1000))
    }
  }, [selectedNode, userLocation])

  return (
    <div className="w-screen h-screen">
      <div className="absolute h-5/6 w-5/6 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 overflow-hidden flex flex-col gap-5">
        {selectedNode && selectedNode.country ? (
          <MapHeader country={selectedNode.country} />
        ) : (
          <></>
        )}
        <div className="h-full rounded-lg bg-cb-gray-600">
          <Map
            nodes={nodes}
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
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default MapInteractor

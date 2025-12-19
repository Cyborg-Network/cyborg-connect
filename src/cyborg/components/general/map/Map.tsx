import React, { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from 'react-simple-maps'
import topoJson from '../../../../map-data/countries-1-to-50m-scale.json'
import { Miner } from '../../../api/parachain/useWorkersQuery'
import { Location } from '../../../types/location'
import { MinerWithCountry } from './MapInteractor'

interface MapProps {
  userCoordinates: Location
  nodes: Miner[]
  handleSelectNode: (node: any) => void
  selectedNode: MinerWithCountry
}

const calculateZoom = (screenSize: number) => {
  const clampedScreenSize = Math.max(300, Math.min(screenSize, 2000))
  const output = 5 - (4 * (clampedScreenSize - 300)) / (2000 - 300)
  return parseFloat(output.toFixed(2))
}

const calculateMapHeight = (screenSize: number) => {
  const clampedScreenSize = Math.max(300, Math.min(screenSize, 2000))
  const output = 600 + (2000 * (2000 - clampedScreenSize)) / (2000 - 300)
  return Math.round(output)
}

const returnNodeColor = (node: Miner, selectedNode: MinerWithCountry) => {
  switch (node.oracle_status.type) {
    case "Online":
      if(selectedNode && node.id === selectedNode.id && node.owner === selectedNode.owner) {
        return '#15E674'
      } else {
        return '#439448'
      }
    case "Offline":
      if(selectedNode && node.id === selectedNode.id && node.owner === selectedNode.owner) {
        return '#737373'
      } else {
        return '#5B5A5A'
    }
  }

  /*
  switch (node.operational_status.type) {
    case "Available":
      if(selectedNode && node.id === selectedNode.id && node.owner === selectedNode.owner) {
        return '#15E674'
      } else {
        return '#439448'
      }
    // case "Suspended":
    //   if(selectedNode && node.id === selectedNode.id && node.owner === selectedNode.owner) {
    //     return '#737373'
    //   } else {
    //     return '#5B5A5A'
    //   }
    // case "Busy":
    //   if(selectedNode && node.id === selectedNode.id && node.owner === selectedNode.owner) {
    //     return '#D23232'
    //   } else {
    //     return '#C42928'
    //   }
  }
  */
}

const Map: React.FC<MapProps> = ({
  userCoordinates,
  nodes,
  handleSelectNode,
  selectedNode,
}) => {
  const [zoom, setZoom] = useState(1)

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ rotate: [0, 0, 0], center: [0, 0], scale: 100 }}
      height={calculateMapHeight(window.innerWidth)}
    >
      <ZoomableGroup
        center={[0, 0]}
        zoom={calculateZoom(window.innerWidth)}
        maxZoom={50}
        onMove={postition => setZoom(postition.zoom)}
      >
        <svg>
          <defs>
            {/* Country gradient */}
            <linearGradient
              id="countryGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="var(--color-foreground)" stopOpacity={.8} />
              <stop offset="100%" stopColor="var(--color-foreground)" stopOpacity={.4} />
            </linearGradient>

            {/* Marker shadow */}
            <filter
              id="markerShadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="2"
                floodColor="#15E674"
                floodOpacity="0.5"
              />
            </filter>
          </defs>
          <Geographies style={{ fill: 'var(--color-foreground)' }} geography={topoJson}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  fill="url(#countryGradient)"
                  stroke="white"
                  strokeWidth={0.03}
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>
          {/*geoMercator expects wrong order*/}
          {userCoordinates ? (
            <Marker
              coordinates={[
                userCoordinates.longitude,
                userCoordinates.latitude,
              ]}
            >
              <circle r={(1 / zoom) * 3} fill="white" />
            </Marker>
          ) : (
            <></>
          )}
          {nodes ? (
            nodes.map((node, index) => (
              <Marker
                key={index}
                coordinates={[node.location.longitude, node.location.latitude]}
              >
                <circle
                  className="hover:cursor-pointer"
                  onClick={() => handleSelectNode(node)}
                  r={(1 / zoom) * 3}
                  fill={returnNodeColor(node, selectedNode)}
                  filter="url(#markerShadow)"
                />
              </Marker>
            ))
          ) : (
            <></>
          )}
        </svg>
      </ZoomableGroup>
    </ComposableMap>
  )
}

export default Map

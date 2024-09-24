import React, { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from 'react-simple-maps'
import topoJson from '../../../../map-data/countries-1-to-50m-scale.json'

const Map = ({ userCoordinates, nodes, handleSelectNode, selectedNode }) => {
  const [zoom, setZoom] = useState(1)

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ rotate: [0, 0, 0], center: [0, 0], scale: 100 }}
    >
      <ZoomableGroup
        center={[0, 0]}
        zoom={1}
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
              <stop offset="0%" stopColor="#455445" stopOpacity={1} />
              <stop offset="100%" stopColor="#576257" stopOpacity={1} />
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
          <Geographies fill="#2C3631" geography={topoJson}>
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
            <Marker coordinates={[userCoordinates.lon, userCoordinates.lat]}>
              <circle r={(1 / zoom) * 3} fill="white" />
            </Marker>
          ) : (
            <></>
          )}
          {nodes ? (
            nodes.map((node, index) => (
              <Marker
                key={index}
                coordinates={[node.location.lon, node.location.lat]}
              >
                <circle
                  className="hover:cursor-pointer"
                  onClick={() => handleSelectNode(node)}
                  r={(1 / zoom) * 3}
                  fill={
                    selectedNode && (node.id === selectedNode.id && node.owner === selectedNode.owner)
                    ? '#15E674'
                    : '#439448'
                  }
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

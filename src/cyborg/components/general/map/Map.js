import React, { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from "react-simple-maps";
import haversineDistance from "haversine-distance";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const realWorldCoords = { lat: 57.7246931, lon: 12.9271694 }

const nodes = [
  {lat: 50.1, lon: 10},
  {lat: 53, lon: 12},
  {lat: 60, lon: 13}
]

const SelectedNodeInfo = ({node, distance}) => {
  return(
    <div className="flex items-center justify-evenly text-lg font-bold text-cb-green absolute w-11/12 h-16 left-1/2 -translate-x-1/2 bottom-20 text-white rounded-lg bg-gray-300 bg-opacity-10 backdrop-blur-lg shadow-glass-shadow">
      <div>{`Node Location: ${node.lon} ${node.lat}`}</div>
      <div>{`Owner: `}</div>
      <div>{`Distance to you: ${distance} kilometers`}</div>
      <div className="text-red-500 text-xl">Everything is mocked, but can be set up to work very quickly</div>
    </div>
  )
}

const Map = () => {
  
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null)
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    if(selectedNode){
      const userLocation = { latitude: realWorldCoords.lat, longitude: realWorldCoords.lon}
      const nodeLocation ={ latitude: selectedNode.lat, longitude: selectedNode.lon}

      setDistance(Math.round(haversineDistance(userLocation, nodeLocation)/1000))
    }
  }, [selectedNode])

  return (
    <div className="h-screen w-screen overflow-hidden bg-cb-gray-600 rounded-lg">
      {selectedNode ? <SelectedNodeInfo node={selectedNode} distance={distance}/> : <></>}
      <ComposableMap projection="geoMercator" projectionConfig={{rotate: [0,0,0], center: [0,0], scale: 100}}>
        <ZoomableGroup center={[0, 0]} zoom={1} maxZoom={50} onMove={postition => setZoom(postition.zoom)}>
          <svg>
          <defs>
            {/* Country gradient */}
            <linearGradient id="countryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#455445" stopOpacity={1} />
              <stop offset="100%" stopColor="#576257" stopOpacity={1} />
            </linearGradient>

            {/* Marker shadow */}
            <filter id="markerShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#15E674" floodOpacity="0.5" />
            </filter>
          </defs>
          <Geographies fill="#2C3631" geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography 
                  fill="url(#countryGradient)" 
                  stroke="white"
                  strokeWidth={.03}
                  key={geo.rsmKey} 
                  geography={geo} 
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none' },
                    pressed: { outline: 'none' }
                  }}/>
              ))
            }
          </Geographies>
          {/*geoMercator expects wrong order*/}
          <Marker coordinates={[realWorldCoords.lon, realWorldCoords.lat]}>
            <circle
              r={1 / zoom * 3}
              fill="white"
            />
          </Marker>
          {nodes.map((node, index) => (
            <Marker key={index} coordinates={[node.lon, node.lat]}>
              <circle
                onClick={() => setSelectedNode(node)}
                r={1 / zoom * 3}
                fill="#15E674"
                filter="url(#markerShadow)"
              />
            </Marker>
          ))}
          </svg>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default Map;

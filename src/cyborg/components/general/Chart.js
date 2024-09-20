import { useEffect, useState } from 'react'
import { VictoryArea, VictoryChart, VictoryAxis, VictoryLabel } from 'victory'
import useResizeObserver from '../../hooks/useResizeObserver'

const Chart = ({ color, data }) => {
  const { ref, width } = useResizeObserver()

  //When logic is implemented this will be calculated based on the returned workload of the worker
  //Y Axis has to be offset by a little bit, else the absolute maxY will overflow
  const maxY = 220
  const domainY = [0, maxY * 1.1]

  const initialState = {
    padding: 60,
    fontSize: 15,
    height: 500,
    Xdx: 0,
    Xdy: 0,
    Ydx: -20,
  }

  const [dimensions, setDimensions] = useState(initialState)

  useEffect(() => {
    if (width < 768) {
      setDimensions({
        padding: 10,
        fontSize: 10,
        height: 300,
        Xdx: 18,
        Xdy: -23,
        Ydx: 27,
      })
    } else if (768 < width && width < 1024) {
      setDimensions({
        padding: 30,
        fontSize: 12,
        height: 500,
        Xdx: 0,
        Xdy: 0,
        Ydx: 27,
      })
    } else {
      setDimensions({
        padding: 60,
        fontSize: 15,
        height: 500,
        Xdx: 0,
        Xdy: 0,
        Ydx: -20,
      })
    }
  }, [width])

  return (
    <div ref={ref} className='VictoryContainer'>
      {/*Position has to be absolute and height of 0 otherwise the svg starts to take up space, it is only supposed to attach itself to the line*/}
      <svg style={{ position: 'absolute' }} height={0}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
          </linearGradient>
        </defs>
      </svg>
      <VictoryChart
        width={width}
        height={dimensions.height}
        padding={dimensions.padding}
        domain={{ y: domainY }}
      >
        <VictoryAxis
          tickLabelComponent={
            <VictoryLabel
              dx={dimensions.Xdx}
              dy={dimensions.Xdy}
              textAnchor="middle"
            />
          }
          style={{
            axis: { stroke: 'var(--cb-gray-400)' },
            ticks: { stroke: 'var(--cb-gray-400)' },
            tickLabels: { fontSize: dimensions.fontSize, fill: 'white' },
            grid: { stroke: 'var(--cb-gray-400)', strokeWidth: 0.5 },
          }}
        />
        <VictoryAxis
          dependentAxis
          tickLabelComponent={
            <VictoryLabel dx={dimensions.Ydx} textAnchor="middle" />
          }
          style={{
            axis: { stroke: 'var(--cb-gray-400)' }, // Custom color for the axis line
            ticks: { stroke: 'var(--cb-gray-400)' },
            tickLabels: { fontSize: dimensions.fontSize, fill: 'white' },
            grid: { stroke: 'var(--cb-gray-400)', strokeWidth: 0.5 },
          }}
          tickFormat={tick => `${tick}GB`}
        />
        <VictoryArea
          animate={{ duration: 1000, onLoad: { duration: 500 } }}
          interpolation={'natural'}
          style={{ data: { fill: 'url(#gradient)', stroke: color } }}
          data={data}
        />
      </VictoryChart>
    </div>
  )
}

export default Chart

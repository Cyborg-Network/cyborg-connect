import { VictoryArea, VictoryChart, VictoryAxis } from 'victory'
import useResizeObserver from '../../hooks/useResizeObserver'
import { useEffect } from 'react'

const Chart = ({ color, data }) => {
  const { ref, width, height } = useResizeObserver()

  //When logic is implemented this will be calculated based on the returned workload of the worker
  //Y Axis has to be offset by a little bit, else the absolute maxY will overflow
  const maxY = 220
  const domainY = [0, maxY * 1.1]

  useEffect(() => {
    console.log(height)
  }, [])

  return (
    <div ref={ref}>
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
        height={500}
        padding={60}
        domain={{ y: domainY }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: 'var(--cb-gray-400)' },
            ticks: { stroke: 'var(--cb-gray-400)' },
            tickLabels: { fontSize: 15, fill: 'white' },
            grid: { stroke: 'var(--cb-gray-400)', strokeWidth: 0.5 },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: 'var(--cb-gray-400)' }, // Custom color for the axis line
            ticks: { stroke: 'var(--cb-gray-400)' },
            tickLabels: { fontSize: 15, fill: 'white' },
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

import React from 'react'
import Chart, { Data } from '../Chart'

interface RenderChartProps {
  metric: string
  data: Data
  color: string
}

const RenderChart: React.FC<RenderChartProps> = ({
  metric,
  data,
  color,
}: RenderChartProps) => {
  return (
    <div className="bg-color-background-2 rounded-lg w-full">
      <div className="flex justify-between pt-6 px-6">
        <div className="text-2xl font-bold">{metric} Usage</div>
        <div>1 Hour</div>
      </div>
      <div className="p-2 lg:p-6 overflow-visible">
        <Chart data={data} color={color} />
      </div>
    </div>
  )
}

export default RenderChart

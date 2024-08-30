import Chart from '../Chart'

function RenderChart({ metric, data, color }) {
  return (
    <div className="bg-cb-gray-600 rounded-lg p-10 col-span-1 lg:col-span-2 xl:col-span-3">
      <div className="flex justify-between">
        <div className="text-2xl font-bold">{metric} Usage</div>
        <div>1 Hour</div>
      </div>
      <div className="p-6 overflow-visible">
        <Chart data={data} color={color} />
      </div>
    </div>
  )
}

export default RenderChart


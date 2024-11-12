import Chart from '../Chart'

function RenderChart({ metric, data, color }) {

  return (
    <div className="bg-cb-gray-600 rounded-lg w-full">
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

import { toast } from 'react-hot-toast'

export function ServerSpecs({ spec, metric, uptime }) {
  return (
    <div className="bg-cb-gray-600 rounded-lg w-full h-full">
      <div className="flex items-center justify-between bg-gradient-to-b from-cb-gray-400 p-6 rounded-lg">
        <div className="font-thin">Server Specifications</div>
        <div className='rounded-full bg-cb-gray-400 border border-gray-500 py-1 px-3 flex items-center'>
          {`Uptime: ${uptime}%`}
        </div>
      </div>

      <ul className="px-6 py-3 h-auto">
        <li className="flex justify-between">
          <p>OS:</p>
          <p>{spec ? spec.operatingSystem.Description : null}</p>
        </li>
        <li
          className="flex justify-between gap-4"
          onClick={
            spec
              ? () => toast(spec.cpuInformation.ModelName)
              : () => {
                  return
                }
          }
        >
          <p>CPU:</p>
          <p className="truncate">
            {spec ? spec.cpuInformation.ModelName : null}
          </p>
        </li>
        <li className="flex justify-between">
          <p>Memory:</p>
          <p>
            {metric && metric.memoryUsage ? metric.memoryUsage.total : null}
          </p>
        </li>
        <li className="flex justify-between">
          <p>Storage:</p>
          <p>
            {metric && metric.diskUsage ? metric.diskUsage[0]['size'] : null}
          </p>
        </li>
        <li className="flex justify-between">
          <p>Location:</p>
          <p>
            {spec
              ? `${spec.localeInformation.city}, ${spec.localeInformation.country}`
              : null}
          </p>
        </li>
      </ul>
    </div>
  )
}

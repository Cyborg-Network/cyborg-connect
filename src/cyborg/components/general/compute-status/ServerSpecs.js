import { toast } from 'react-hot-toast'

export function ServerSpecs({ specs, metric, uptime }) {
  return (
    <div className="bg-cb-gray-600 rounded-lg w-full h-full">
      <div className="flex items-center justify-between bg-gradient-to-b from-cb-gray-400 p-6 rounded-lg">
        <div className="font-thin">Server Specifications</div>
        <div className="rounded-full bg-cb-gray-400 border border-gray-500 py-1 px-3 flex items-center">
          {`Uptime: ${uptime}%`}
        </div>
      </div>

      <ul className="px-6 py-3 h-auto">
        <li className="flex justify-between">
          <p>OS:</p>
          <p>{specs ? specs.specs.os : null}</p>
        </li>
        <li
          className="flex justify-between gap-4"
          onClick={
            specs
              ? () => toast(specs.specs.cpus[0])
              : () => {
                  return
                }
          }
        >
          <p>CPU:</p>
          <p className="truncate">
            {specs ? specs.specs.cpus[0] : null}
          </p>
        </li>
        <li className="flex justify-between">
          <p>Memory:</p>
          <p>
            {specs ? `~${Math.round(specs.specs.memory / (1024 * 1024))} MB` : null}
          </p>
        </li>
        <li className="flex justify-between">
          <p>Storage:</p>
          <p>
            {specs ? `~${Math.round(specs.specs.disk / 1073741824)} GB` : null}
          </p>
        </li>
        <li className="flex justify-between">
          <p>Location:</p>
          <p>
            {specs
              ? /*`${specs.location.coordinates[0]}, ${specs.location.coordinates[1] }`*/'5.7721, 1.29401'
              : null}
          </p>
        </li>
      </ul>
    </div>
  )
}

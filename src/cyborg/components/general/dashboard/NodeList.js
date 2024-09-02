import { useNavigate } from 'react-router-dom'
import cyberdock from '../../../../../public/assets/icons/cyberdockDash.png'
import { ROUTES } from '../../../../index'

export function NodeList({ nodes, taskMetadata }) {
  const navigate = useNavigate()

  const lastTask = taskMetadata.taskId

  console.log('nodes: in list: ', nodes)
  console.log('lastTask: ', lastTask)

  return (
    <div className="flex flex-col w-full text-white text-opacity-70 ">
      <span
        className={`${nodes.length < 1 ? 'hidden' : ''} flex w-full py-2 px-5`}
      >
        <ul className="grid grid-cols-4 w-full">
          <li>Name / Address</li>
          <li>Type</li>
          <li>URL / IP</li>
          <li>Status</li>
        </ul>
      </span>
      <div className="bg-white bg-opacity-10 m-4 rounded-lg">
        {nodes.length > 0 &&
          nodes.map(item => (
            <div
              key={item.owner + item.id}
              onClick={() =>
                navigate(`${ROUTES.COMPUTE_STATUS}/${item.api.domain}`, {
                  state: item,
                })
              }
              className={`hover:text-cb-green hover:font-bold hover:cursor-pointer ${
                lastTask === item.lastTask
                  ? 'p-1 border border-transparent bg-gradient-to-r from-cb-green via-yellow-500 to-cb-green bg-clip-border animated-border'
                  : ''
              }`}
            >
              <span className="flex justify-between w-full items-center py-4 px-5 bg-cb-gray-400">
                <ul className="grid grid-cols-4 w-full items-center">
                  <li className="flex items-center gap-3]">
                    <a>
                      <img src={cyberdock} />
                    </a>
                    <button className="pl-3 flex flex-col items-start">
                      <p className="mt-0 text-sm">
                        ID:{item.owner.slice(0, 16)}:{item.id}
                      </p>
                    </button>
                  </li>
                  <li>Providers</li>
                  <li>{`${item.api.domain}`}</li>
                  <li
                    className={`flex gap-2 ${
                      item.status ? 'text-cb-green' : 'text-red-600'
                    }`}
                  >
                    {item.lastTask ? `taskId: ${item.lastTask}` : 'idle'}
                    <p
                      className={`font-bold ${
                        lastTask === item.lastTask
                          ? 'right-2 top-2 text-white'
                          : 'hidden'
                      }`}
                    >
                      Task Executed
                    </p>
                  </li>
                </ul>
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}

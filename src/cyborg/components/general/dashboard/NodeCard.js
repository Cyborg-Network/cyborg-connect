import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../../index';
import cyberdock from '../../../../../public/assets/icons/cyberdockDash.png'

const NodeCard = ({ item, lastTask }) => {

  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`${ROUTES.COMPUTE_STATUS}/${item.api.domain}`, {
          state: item,
        })
      }
      className={`hover:text-cb-green hover:font-bold hover:cursor-pointer rounded-lg lg:rounded-none ${
        lastTask === item.lastTask
          ? 'p-1 border border-transparent bg-gradient-to-r from-cb-green via-yellow-500 to-cb-green bg-clip-border animated-border'
          : ''
      }`}
    >
      <div className="lg:w-full items-center py-4 px-5 bg-cb-gray-400 rounded-lg lg:rounded-none">
        <ul className="grid grid-rows-4 lg:grid-cols-4 lg:grid-rows-1 w-full items-center">
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
      </div>
    </div>
  )
}

export default NodeCard

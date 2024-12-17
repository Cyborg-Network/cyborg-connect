import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../../index'
import cyberdock from '../../../../../public/assets/icons/cyberdockDash.png'
import { Separator } from '../Separator'
import useService from '../../../hooks/useService'

const NodeCard = ({ item, lastTask }) => {
  const navigate = useNavigate()
  const service = useService()

  //li with exactly these specs needed a lot here, sets parent up for responsiveness
  const LI = ({ children, additionalClasses }) => (
    <li className={`w-full flex justify-between ${additionalClasses}`}>
      {children}
    </li>
  )

  const navigateToComputeScreen = () => {
    if(service.id === "CYBER_DOCK"){
      navigate(`${ROUTES.CYBERDOCK_COMPUTE_STATUS}/${item.api.domain}`, {
          state: item,
      })
    }
    if(service.id === "EXECUTABLE"){
      navigate(`${ROUTES.EXECUTABLE_COMPUTE_STATUS}/${item.api.domain}`, {
          state: item,
      })
    }
  }

  //span with exactly these specs needed a lot here, sets parent up for responsiveness
  const SPAN = ({ children }) => <span className="lg:hidden">{children}</span>

  return (
    <div
      onClick={() => navigateToComputeScreen()}
      className={`hover:text-cb-green hover:font-bold hover:cursor-pointer rounded-lg lg:rounded-none`}
    >
      <div className="lg:w-full items-center py-4 px-5 bg-cb-gray-400 rounded-lg">
        <ul className="w-full flex flex-col gap-2 items-center lg:grid lg:gap-0 lg:grid-cols-4 lg:grid-rows-1">
          <li className="flex items-center gap-3]">
            <a>
              <img src={cyberdock} />
            </a>
            <button className="pl-3 flex flex-col items-start">
              <p className="mt-0 text-lg lg:text-sm">
                ID:{item.owner.slice(0, 16)}:{item.id}
              </p>
            </button>
          </li>
          <LI>
            <SPAN>Type:</SPAN>
            <span>Providers</span>
          </LI>
          <Separator
            colorClass={'bg-gray-500'}
            additionalStyles={'lg:hidden'}
          />
          <LI>
            <SPAN>IP / URL:</SPAN>
            <span>{/*`${item.api.domain}`*/'16.171.249.42'}</span>
          </LI>
          <Separator
            colorClass={'bg-gray-500'}
            additionalStyles={'lg:hidden'}
          />
          <LI
            additionalClasses={`flex gap-2 ${
              item.status ? 'text-cb-green' : 'text-red-600'
            }`}
          >
            <SPAN>Status:</SPAN>
            <span className="flex gap-2">
              {item.lastTask ? `taskId: ${item.lastTask}` : 'Active'}
              <p
                className={`font-bold ${
                  lastTask === item.lastTask
                    ? 'right-2 top-2 text-white'
                    : 'hidden'
                }`}
              >
                Task Executing...
              </p>
            </span>
          </LI>
        </ul>
      </div>
    </div>
  )
}

export default NodeCard

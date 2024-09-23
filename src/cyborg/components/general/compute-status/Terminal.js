import { GetLogs } from './GetLogs'
import widget from '../../../../../public/assets/icons/widget.png'
import { PiMouseScrollLight } from 'react-icons/pi'
import { useState } from 'react'

export function Terminal({ link, taskId }) {
  const [scrollIsAutomated, setScrollIsAutomated] = useState(true)

  console.log('terminal task: ', taskId)
  return (
    <div className="bg-white bg-opacity-15 relative rounded-lg flex flex-col">
      <div className="absolute top-5 left-5">
        <a>
          <img src={widget} />
        </a>
      </div>
      <div className="bg-gradient-to-b from-cb-gray-400 to-cb-gray-600 p-6 rounded-t-lg">
        <h4 className="flex justify-center font-thin">Terminal</h4>
      </div>
      <div
        onClick={() => setScrollIsAutomated(!scrollIsAutomated)}
        className={`absolute hover:cursor-pointer top-5 right-5 ${
          scrollIsAutomated ? 'text-white' : 'text-cb-green'
        }`}
      >
        <PiMouseScrollLight size={25} />
      </div>
      <ul className="h-80 bg-cb-gray-700">
        {/* <li className='flex justify-between'><p>Last Login:</p><p>Fri June 04, 01:34:00</p></li> */}
        <GetLogs
          scrollIsAutomated={scrollIsAutomated}
          link={link}
          taskId={taskId}
        />
      </ul>
    </div>
  )
}

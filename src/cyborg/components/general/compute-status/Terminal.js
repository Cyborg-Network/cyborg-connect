import { GetLogs } from './GetLogs'
import widget from '../../../../../public/assets/icons/widget.png'

export function Terminal({ link, taskId }) {
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
      <ul className="h-full">
        {/* <li className='flex justify-between'><p>Last Login:</p><p>Fri June 04, 01:34:00</p></li> */}
        <GetLogs link={link} taskId={taskId} />
      </ul>
    </div>
  )
}

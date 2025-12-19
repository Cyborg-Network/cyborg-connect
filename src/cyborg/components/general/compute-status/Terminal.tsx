import { GetLogs } from './GetLogs'
import widget from '../../../../../public/assets/icons/widget.png'
import { PiMouseScrollLight } from 'react-icons/pi'
import React, { useState } from 'react'

interface TerminalProps {
  link: string
  taskId: bigint
  logs: string[]
}

export const Terminal: React.FC<TerminalProps> = ({
  link,
  taskId,
  logs,
}: TerminalProps) => {
  const [scrollIsAutomated, setScrollIsAutomated] = useState(true)

  //console.log('terminal task: ', taskId)

  return (
    <div className="bg-color-background-2 bg-opacity-15 relative rounded-lg flex flex-col">
      <div className="absolute top-5 left-5">
        <div>
          <img alt="Terminal Decoration" src={widget} />
        </div>
      </div>
      <div className="bg-gradient-to-b from-color-background-4 to-color-background-2 p-6 rounded-t-lg">
        <h4 className="flex justify-center font-thin">Terminal</h4>
      </div>
      <div
        onClick={() => setScrollIsAutomated(!scrollIsAutomated)}
        className={`absolute hover:cursor-pointer top-5 right-5 ${
          scrollIsAutomated ? 'text-white' : 'text-color-foreground'
        }`}
      >
        <PiMouseScrollLight size={25} />
      </div>
      <ul className="h-80 bg-color-background-2">
        {/* <li className='flex justify-between'><p>Last Login:</p><p>Fri June 04, 01:34:00</p></li> */}
        <GetLogs
          scrollIsAutomated={scrollIsAutomated}
          logs={logs}
          link={link}
          taskId={taskId}
        />
      </ul>
    </div>
  )
}

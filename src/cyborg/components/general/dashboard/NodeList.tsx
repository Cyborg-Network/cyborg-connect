import React from 'react'
import NodeCard from './NodeCard'
import { Miner } from '../../../types/miner'

interface Props {
  nodes: [any],
  isProvider: boolean,
}

const NodeList = ({ nodes, isProvider }) => {

  return (
    <div className="flex flex-col w-full text-white text-opacity-70 ">
      <span
        className={`${nodes.length < 1 ? 'hidden' : ''} flex w-full py-2 px-5`}
      >
        <ul className="hidden lg:grid grid-cols-4 w-full">
          <li>Name / Address</li>
          <li>Type</li>
          <li>URL / IP</li>
          <li>Status</li>
        </ul>
      </span>
      <div className="grid gap-3 m-4 rounded-lg">
        {nodes.length > 0 &&
          nodes.map(item => (
            <NodeCard
              key={item.owner + item.id}
              item={item}
              lastTask={item.lastTask}
              isProvider={isProvider}
            />
          ))}
      </div>
    </div>
  )
}

export default NodeList

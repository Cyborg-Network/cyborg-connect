import { toast } from 'react-hot-toast'
import { i32CoordinateToFloatCoordinate } from '../../../util/coordinateConversion'
import React from 'react'
import { MinerSpecs } from '../../../types/agent'

interface ServerSpecsProps {
  specs: MinerSpecs
  uptime: number
}

export const ServerSpecs: React.FC<ServerSpecsProps> = ({
  specs,
  uptime,
}: ServerSpecsProps) => {
  return (
    <div className="bg-color-background-2 rounded-lg w-full h-full">
      <div className="flex items-center justify-between bg-gradient-to-b from-color-background-4 p-6 rounded-lg">
        <div className="font-thin text-color-text-2">Server Specifications</div>
        <div className="rounded-full bg-color-background-4 border border-gray-500 py-1 px-3 flex items-center text-color-text-2">
          {`Uptime: ${uptime}%`}
        </div>
      </div>

      <ul className="px-6 py-3 h-auto">
        <li className="flex justify-between">
          <p className='text-color-text-2'>OS:</p>
          <p className='text-color-text-2'>{specs ? specs.specs.os : null}</p>
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
          <p className='text-color-text-2'>CPU:</p>
          <p className="truncate text-color-text-2">{specs ? specs.specs.cpus[0] : null}</p>
        </li>
        <li className="flex justify-between">
          <p className='text-color-text-2'>Memory:</p>
          <p className='text-color-text-2'>
            {specs ? `~${Math.round(specs.specs.memory / (1024 * 1024))} MB` : null}
          </p>
        </li>
        <li className="flex justify-between">
          <p className='text-color-text-2'>Storage:</p>
          <p className='text-color-text-2'>{specs ? `~${Math.round(specs.specs.disk / 1073741824)} GB` : null}</p>
        </li>
        <li className="flex justify-between">
          <p className='text-color-text-2'>Location:</p>
          <p className='text-color-text-2'>
            {specs
              ? `
                  ${i32CoordinateToFloatCoordinate(
                    specs.location.coordinates[0]
                  )}, 
                  ${i32CoordinateToFloatCoordinate(
                    specs.location.coordinates[1]
                  )}
                `
              : null}
          </p>
        </li>
      </ul>
    </div>
  )
}

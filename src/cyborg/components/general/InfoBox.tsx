import React, { ReactNode } from 'react'
import { useState } from 'react'
import { BsQuestion } from 'react-icons/bs'

interface Props {
  children: ReactNode
}

const InfoBox: React.FC<Props> = ({ children }: Props) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-full p-0.5 border border-color-text-1 text-color-text-1"
    >
      <BsQuestion size={16} />
      {isHovered ? (
        <div className="absolute top-full left-full rounded-lg border border-2 border-color-background-4 bg-color-background-2 text-color-text-2 w-96 p-6 text-lg">
          {children}
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default InfoBox

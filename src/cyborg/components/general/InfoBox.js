import { useState } from 'react'
import { BsQuestion } from 'react-icons/bs'

const InfoBox = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-full bg-cb-gray-70 p-1 border border-white text-white"
    >
      <BsQuestion size={16} />
      {isHovered ? (
        <div className="absolute top-full left-full rounded-lg border border-cb-gray-400 bg-cb-gray-600 text-white w-96 p-6 text-lg">
          {children}
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default InfoBox

import React, { useState } from 'react'

interface Props {
  logo: string
  title: string
  description: string
  additionalClasses?: string
  onClick: () => void
}

const ServiceCard: React.FC<Props> = ({
  logo,
  title,
  description = '',
  additionalClasses,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`${additionalClasses} border border-2 ${
        isHovered ? 'hover:ring-2 hover:ring-color-foreground border-color-foreground' : ''
      } border-color-background-4 rounded-md w-80 hover:cursor-pointer`}
      onMouseDown={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-color-text-1 flex flex-col items-center focus:text-color-foreground bg-color-background-1 h-full justify-between">
        <a className="pt-10">
          <div className="p-4 rounded-full bg-color-background-4">
            <img src={logo} />
          </div>
        </a>

        <h3>{title}</h3>
        <p className="opacity-50 text-center">
          {description}
        </p>
        <div
          className={`text-color-text-2 grid justify-center items-center text-lg font-bold bg-color-background-4 w-full h-14 ${
            isHovered ? 'bg-color-foreground text-white' : ''
          }`}
        >
          Deploy Now
        </div>
      </div>
    </div>
  )
}

export default ServiceCard

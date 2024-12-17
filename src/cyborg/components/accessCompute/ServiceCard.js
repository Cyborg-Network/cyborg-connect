import { useState } from "react"

const ServiceCard = ({
  logo,
  title,
  description = '',
  additionalClasses,
  onClick,
}) => {

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`${additionalClasses} border ${isHovered ? 'hover:ring-2 hover:ring-cb-green border-cb-green' : ''} border-cb-gray-400 rounded-md w-80 hover:cursor-pointer`}
      onMouseDown={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center focus:text-cb-green bg-cb-gray-600 h-full justify-between">
        <a className="pt-10">
          <div className="p-4 rounded-full bg-cb-gray-500">
            <img src={logo} />
          </div>
        </a>

        <h3 className="text-white">{title}</h3>
        <p className="text-white opacity-50 text-center text-sm">
          {description}
        </p>
        <div className={`text-gray-400 grid justify-center items-center text-lg font-bold bg-cb-gray-400 w-full h-14 ${isHovered ? 'bg-cb-green text-white' : ''}`}>
          Deploy Now
        </div>
      </div>
    </div>
  )
}

export default ServiceCard

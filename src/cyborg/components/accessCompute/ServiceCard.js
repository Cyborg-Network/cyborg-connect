const ServiceCard = ({
  logo,
  title,
  description = '',
  setService,
  service = null,
  additionalClasses
}) => {
  return (
    <div 
      className={`${additionalClasses} border hover:text-cb-green hover:cursor-pointer text-white hover:ring-2 hover:ring-cb-gray-400 border-cb-gray-400 rounded-md w-80`}
      onClick={() => setService(service)}
    >
      <div className="flex flex-col items-center focus:text-cb-green bg-cb-gray-600 h-full justify-between">
        <a className="pt-10">
          <img src={logo} />
        </a>

        <h3 className="text-white">{title}</h3>
        <p className="text-white opacity-50 text-center text-sm">
          {description}
        </p>
        <div className="grid justify-center items-center text-lg font-bold opacity-50 bg-cb-gray-400 w-full h-14">
          Deploy Now
        </div>
      </div>
    </div>
  )
}

export default ServiceCard

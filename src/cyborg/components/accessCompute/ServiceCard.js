const ServiceCard = ({
  logo,
  title,
  description = '',
  setService,
  service = null,
}) => {
  return (
    <div className="border hover:ring-2 hover:ring-cb-gray-400 border-cb-gray-400 rounded-md w-80">
      <div className="flex flex-col items-center focus:text-cb-green bg-cb-gray-600 h-full justify-between">
        <a className="pt-10">
          <img src={logo} />
        </a>

        <h3 className="text-white">{title}</h3>
        <p className="text-white opacity-50 text-center text-sm">
          {description}
        </p>
        <div className="flex justify-center text-white opacity-50 bg-cb-gray-400 w-full h-14">
          <button
            onClick={() => setService(service)}
            className="hover:text-cb-green"
          >
            <h4>Deploy Now</h4>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServiceCard

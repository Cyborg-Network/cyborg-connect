import React from 'react'
import ServiceCard from './ServiceCard'
import { useCyborg, SERVICES } from '../../CyborgContext'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../index'

function ChooseServices() {
  const { selectService } = useCyborg()
  const navigate = useNavigate()

  const handleSelectService = (service, route) => {
    selectService(service)
    navigate(route)
  }

  return (
    <div className="relative py-20 flex flex-col items-center justify-center md:py-0">
      <h1 className="text-white">Choose Services</h1>
      <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row gap-4 p-2">
        <ServiceCard 
          logo={SERVICES.EXECUTABLE.icon} 
          title={SERVICES.EXECUTABLE.name}
          description="(deploy executable files at ease)"
          onClick={() => handleSelectService(SERVICES.EXECUTABLE, ROUTES.EXECUTABLE_MAP)}
        />
        <ServiceCard
          logo={SERVICES.CYBER_DOCK.icon}
          title="Cyber Dock"
          description="(deploy docker images at ease)"
          onClick={() => handleSelectService(SERVICES.CYBER_DOCK, ROUTES.CYBERDOCK_MAP)}
          setService={selectService}
          service={SERVICES.CYBER_DOCK}
        />
        <ServiceCard
          additionalClasses="sm:col-span-2 sm:justify-self-center"
          logo={SERVICES.NO_SERVICE.icon}
          title="Coming Soon..."
        />
      </div>
      <div className="flex sm:flex-row flex-col gap-4 p-3">
        <ServiceCard logo={SERVICES.NO_SERVICE.icon} title="Coming Soon..." />
        <ServiceCard logo={SERVICES.NO_SERVICE.icon} title="Coming Soon..." />
      </div>
    </div>
  )
}

export default ChooseServices

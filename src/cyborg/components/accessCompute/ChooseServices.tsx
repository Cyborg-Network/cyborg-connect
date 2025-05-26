import React from 'react'
import ServiceCard from './ServiceCard'
import { ROUTES } from '../../../index'
import useService from '../../hooks/useService'
import { SERVICES, Service } from '../../hooks/useService'
import comingsoon from '../../../../public/assets/icons/comingsoon.svg'
import { useNavigate } from 'react-router-dom'

const ChooseServices: React.FC = () => {
  const { setService } = useService()
  const navigate = useNavigate()

  const handleSelectService = (service: Service, route) => {
    setService(service.id)
    navigate(route)
  }

  return (
    <div className="relative py-20 flex flex-col items-center justify-center md:py-0">
      <h1 className="text-white">Choose Services</h1>
      <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row gap-4 p-2">
        <ServiceCard
          logo={SERVICES.NZK.icon}
          title={SERVICES.NZK.name}
          description="(deploy executable files at ease)"
          onClick={() => handleSelectService(SERVICES.NZK, ROUTES.MAP)}
        />
        <ServiceCard
          logo={SERVICES.OI.icon}
          title={SERVICES.OI.name}
          description="(deploy docker images at ease)"
          onClick={() => handleSelectService(SERVICES.OI, ROUTES.MAP)}
        />
        <ServiceCard
          additionalClasses="sm:col-span-2 sm:justify-self-center"
          logo={comingsoon}
          title="More coming Soon..."
          description=""
          onClick={() => {}}
        />
      </div>
    </div>
  )
}

export default ChooseServices

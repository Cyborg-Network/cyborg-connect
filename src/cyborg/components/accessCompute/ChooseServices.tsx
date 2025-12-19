import React from 'react'
import ServiceCard from './ServiceCard'
import { ROUTES } from '../../../index'
import useService from '../../hooks/useService'
import { SERVICES, Service } from '../../hooks/useService'
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
      <h1 className="text-color-text-1">Choose Services</h1>
      <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row gap-4 p-2">
        <ServiceCard
          logo={SERVICES.CYCL.icon}
          title={SERVICES.CYCL.name}
          description="Deploy Compute to Cyborg Network"
          onClick={() => handleSelectService(SERVICES.CYCL, ROUTES.MAP)}
        />
        {/*
        <ServiceCard
          additionalClasses="sm:col-span-2 sm:justify-self-center"
          logo={SERVICES.FI.icon}
          title={SERVICES.FI.name}
          description="Deploy Models Instantly on the Edge"
          onClick={() => handleSelectService(SERVICES.FI, ROUTES.MAP)}
        />
        <ServiceCard
          logo={SERVICES.NZK.icon}
          title={SERVICES.NZK.name}
          description="Perform ZK Inference"
          onClick={() => handleSelectService(SERVICES.NZK, ROUTES.MAP)}
        />
        */}
      </div>
      <h4>More coming soon...</h4>
    </div>
  )
}

export default ChooseServices

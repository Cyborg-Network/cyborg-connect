import { useState } from 'react'
import oi from '../../../public/assets/icons/cyberdock.svg'
import nzk from '../../../public/assets/icons/neuro-zk.svg'
import toast from 'react-hot-toast'

type ServiceId = 'OI' | 'NZK' | 'FI'

export interface Service {
  id: ServiceId
  name: string
  icon: string
  substrateEnumValue: string
  workerType: 'edgeMiners' | 'cloudMiners'
}

export const SERVICES: Record<string, Service> = {
  FI: {
    id: 'FI',
    name: 'Flash Infer',
    icon: oi,
    substrateEnumValue: 'executable',
    workerType: 'edgeMiners',
  },
  OI: {
    id: 'OI',
    name: 'Open Inference',
    icon: oi,
    substrateEnumValue: 'executable',
    workerType: 'edgeMiners',
  },
  NZK: {
    id: 'NZK',
    name: 'Neuro ZK',
    icon: nzk,
    substrateEnumValue: 'executable',
    workerType: 'edgeMiners',
  },
}

const useService = () => {
  const [service, setServiceState] = useState<Service | null>(() => {
    const s = localStorage.getItem('currentService')
    if (s) {
      try {
        const serviceString = JSON.parse(s)
        if (
          serviceString === SERVICES.OI.id ||
          serviceString === SERVICES.NZK.id || 
          serviceString === SERVICES.FI.id
        ) {
          return SERVICES[serviceString]
        } else {
          toast(
            'Invalid service selection resulting in no service being selected...'
          )
        }
      } catch (e) {
        toast(
          'Invalid service selection resulting in no service being selected...'
        )
      }
    }
    return null
  })

  const setService = (id: ServiceId) => {
    localStorage.setItem('currentService', JSON.stringify(id))
    setServiceState(SERVICES[id])
  }

  return { service, setService }
}

export default useService

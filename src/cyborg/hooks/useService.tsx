import { useState } from 'react'
import oi from '../../../public/assets/icons/cyberdock.svg'
import nzk from '../../../public/assets/icons/neuro-zk.svg'
import cycl from '../../../public/assets/icons/comingsoon.svg'
import toast from 'react-hot-toast'

type ServiceId = 'OI' | 'NZK' | 'FI' | 'CYCL'

export interface Service {
  id: ServiceId
  name: string
  icon: string
  substrateEnumValue: string
  workerType: 'executableWorkers' | 'workerClusters'
}

export const SERVICES: Record<string, Service> = {
  CYCL: {
    id: 'CYCL',
    name: 'CyCloud',
    icon: cycl,
    substrateEnumValue: 'executable',
    workerType: 'executableWorkers',
  },
  FI: {
    id: 'FI',
    name: 'Flash Infer',
    icon: oi,
    substrateEnumValue: 'executable',
    workerType: 'executableWorkers',
  },
  OI: {
    id: 'OI',
    name: 'Open Inference',
    icon: oi,
    substrateEnumValue: 'executable',
    workerType: 'executableWorkers',
  },
  NZK: {
    id: 'NZK',
    name: 'Neuro ZK',
    icon: nzk,
    substrateEnumValue: 'executable',
    workerType: 'executableWorkers',
  },
}

const useService = () => {
  const [service, setServiceState] = useState<Service | null>(() => {
    const s = localStorage.getItem('currentService')
    if (s) {
      try {
        const serviceString = JSON.parse(s)
        if (
          serviceString in SERVICES
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

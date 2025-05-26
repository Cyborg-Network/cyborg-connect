import { useState } from 'react'
import oi from '../../../public/assets/icons/cyberdock.svg'
import nzk from '../../../public/assets/icons/neuro-zk.svg'
import toast from 'react-hot-toast'

type ServiceId = 'OI' | 'NZK'

export interface Service {
  id: ServiceId
  name: string
  icon: string
  substrateEnumValue: string
  workerType: 'executableWorkers' | 'workerClusters'
}

export const SERVICES: Record<string, Service> = {
  OI: {
    id: 'OI',
    name: 'Open Inference',
    icon: oi,
    substrateEnumValue: 'docker',
    workerType: 'workerClusters',
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
  console.log('USE_SERVICE')
  const [service, setServiceState] = useState<Service | null>(() => {
    console.log('USE_SERVICE USE_EFFECT')
    const s = localStorage.getItem('currentService')
    console.log('USE_SERVICE - s', s)
    if (s) {
      try {
        const serviceString = JSON.parse(s)
        if (
          serviceString === SERVICES.OI.id ||
          serviceString === SERVICES.NZK.id
        ) {
          console.log('USE_SERVICE - id', serviceString)
          return SERVICES[serviceString]
        } else {
          console.log('USE_SERVICE: if else')
          toast(
            'Invalid service selection resulting in no service being selected...'
          )
        }
      } catch (e) {
        console.log('USE_SERVICE: catch')
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

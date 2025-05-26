import { SERVICES } from '../hooks/useService'

export const returnCorrectWorkers = (workers, service) => {
  switch (service.id) {
    case SERVICES.OI.id:
      return workers.executableWorkers
    case SERVICES.NZK.id:
      return workers.executableWorkers
  }
}

import { SERVICES } from "../CyborgContext"

export const returnCorrectWorkers = (workers, service) => {
  switch(service.id) {
    case SERVICES.CYBER_DOCK.id:
    return workers.workerClusters
    case SERVICES.EXECUTABLE.id:
    return workers.executableWorkers
  }
}

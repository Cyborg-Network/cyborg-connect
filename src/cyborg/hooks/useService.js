import { useLocation } from 'react-router-dom'
import { SERVICES } from '../CyborgContext'

function useService() {
  const location = useLocation().pathname

  let service = SERVICES.NO_SERVICE;

  if(location.includes('cyberdock')) {
    service = SERVICES.CYBER_DOCK;
  } else if(location.includes('executable')) {
    service = SERVICES.EXECUTABLE;
  }

  return service
}

export default useService

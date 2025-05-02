import { useLocation } from 'react-router-dom'
import { SERVICES } from '../CyborgContext'

//TODO: Temporary band-aid, when moving to TS / other routing options (rec: @tanstack/router, requires vite) this should be replaced and probably be put in the URL

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

import { useLocation } from 'react-router-dom'
import cyberdock from '../../../public/assets/icons/cyberdock.png';

const services = {
  noService: {id: "0", name: "No service selected", icon: cyberdock},
  cyberdock: {id: "CYBER_DOCK", name: "Cyber Dock", icon: cyberdock},
}

function useService() {
  const location = useLocation().pathname

  let service = services.noService

  switch(location.includes('cyberdock')) {
    case true:
      service = services.cyberdock
      break;
    default:
       service = services.noService
  }

  return service
}

export default useService

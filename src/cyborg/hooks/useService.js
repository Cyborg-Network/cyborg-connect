import { useLocation } from 'react-router-dom'
import cyberdock from '../../../public/assets/icons/cyberdock.png';
import neuralplaceholder from '../../../public/assets/icons/neural-placeholder.png'

const services = {
  noService: {id: "0", name: "No service selected", icon: cyberdock},
  cyberdock: {id: "CYBER_DOCK", name: "Cyber Dock", icon: cyberdock},
  neuralzk: {id: "NEURAL_ZK", name: "Neural ZK", icon: neuralplaceholder}
}

function useService() {
  const location = useLocation().pathname

  let service = services.noService

  if(location.includes('cyberdock')) {
    service = services.cyberdock
  } else if(location.includes('neuralzk')) {
    service = services.neuralzk
  }

  return service
}

export default useService

import Button from '../buttons/Button'
import { TiArrowRight } from 'react-icons/ti'

const NodeInformationBar = ({
  node,
  distance,
  returntoNearestNode,
  onNavigate,
}) => {
  return (
    <div className="flex items-center justify-evenly text-lg text-cb-green absolute w-11/12 h-16 left-1/2 -translate-x-1/2 bottom-20 text-white rounded-lg bg-gray-300 bg-opacity-10 backdrop-blur-md shadow-glass-shadow">
      <div className="font-bold">{`Node Location: ${node.location.latitude} ${node.location.longitude}`}</div>
      <div className="font-bold">{`Owner: ${node.owner}`}</div>
      <div className="font-bold">{`Distance to you: ${distance} kilometers`}</div>
      <Button variation={'secondary'} onClick={returntoNearestNode}>
        Find nearest Node
      </Button>
      <Button variation={'primary'} onClick={() => onNavigate()}>
        <div className="flex gap-2">
          <div>Proceed With Selected Node</div>
          <TiArrowRight />
        </div>
      </Button>
      {/*<div className="text-red-500 text-xl">Everything is mocked, but can be set up to work very quickly</div>*/}
    </div>
  )
}

export default NodeInformationBar

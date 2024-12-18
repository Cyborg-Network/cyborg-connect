import Button from '../buttons/Button'
import { TiArrowRight } from 'react-icons/ti'
import TruncatedAddress from '../TruncatedAddress'

const NodeInformationBar = ({
  node,
  distance,
  returntoNearestNode,
  onNavigate,
}) => {
  return (
    <div className="p-3 grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4 items-center justify-evenly text-lg text-cb-green absolute w-11/12 h-fit left-1/2 -translate-x-1/2 bottom-20 text-white rounded-lg bg-gray-300 bg-opacity-10 backdrop-blur-md shadow-glass-shadow">
      <div className="font-bold">{`Worker Location: ${node.location.latitude} ${node.location.longitude}`}</div>
      <div className="font-bold flex flex-col sm:flex-row">
        <div>Owner: </div>
        <TruncatedAddress address={node.owner} screenWidth={3000} />
      </div>
      <div className="font-bold">{`Distance to you: ${distance} kilometers`}</div>
      <Button variation={'secondary'} onClick={returntoNearestNode}>
        Find Nearest
      </Button>
      <Button variation={'primary'} additionalClasses="grid justify-center" onClick={() => onNavigate()}>
        <div className="flex gap-2">
          <div>Proceed</div>
          <TiArrowRight />
        </div>
      </Button>
      {/*<div className="text-red-500 text-xl">Everything is mocked, but can be set up to work very quickly</div>*/}
    </div>
  )
}

export default NodeInformationBar

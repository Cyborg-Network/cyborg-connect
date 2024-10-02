import polkadotLogo from '../../../../../public/assets/icons/dot.svg'
import { FaRegClock } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";

const truncateAddress = address => {
  if (window.innerWidth < 600) {
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  } else {
    return address
  }
}

const FlexContainer = ({children}) => {
  return (
  <div className='flex items-center gap-1'>
    {children}
  </div>
  )
}

export function MetaDataHeader({ owner, id, domain, status, lastCheck }) {

  const isOnline = (status === 'active' || status === 'busy') ? true : false;
  const isBusy = (status === 'busy' || status !== 'active') ? true : false;

  return (
    <div className='grid gap-2 justify-end md:flex md:justify-between'>
      <div className="flex text-white gap-3 flex-row-reverse md:flex-row flex-nowrap items-center">
        <div className="rounded-md bg-cb-gray-600 h-full aspect-square p-3 flex items-center justify-center">
          <img src={polkadotLogo}/>
        </div>
        <div className='justify-end md:justify-start flex flex-col gap-1'> 
          <div className='text-xl font-bold text-right md:text-left'>Polkadot</div>
          <div className='text-nowrap flex gap-1'>
            RPC Node |<span>{!isBusy ? <FlexContainer>Available<FaCheck/></FlexContainer> : <FlexContainer>Busy <FaRegClock/></FlexContainer>}</span>
          </div>
        </div>
      </div>
      <div className="grid gap-2 text-right justify-end md:items-center items-end mx-2 text-white">
        <div className="flex items-center gap-2 lg:text-xl justify-end">
          <div className="text-lg">Node Name: </div>
          <div className="text-cb-green">
            {truncateAddress(owner)}:{id}
          </div>
        </div>
        <div className="flex flex-col-reverse items-end justify-end md:flex-row md:items-center gap-3 text-lg">
          <div className="text-opacity-50 text-white">IP Address: <span className='text-white text-opacity-100'>{domain}</span></div>
          <div className="bg-cb-gray-600 w-fit text-md rounded-full text-white">
            <div className={`h-full w-fit rounded-full border ${isOnline ? 'bg-green-400 border-green-500' : 'bg-red-500 border-red-500'}  bg-opacity-15 flex  gap-2 py-1 px-3 items-center`}> 
              <div className={`h-3 aspect-square rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} `}/>
              <div>{`${ isOnline ? 'Online' : 'Offline'}, Last Check: ${lastCheck}`}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MetaDataHeader

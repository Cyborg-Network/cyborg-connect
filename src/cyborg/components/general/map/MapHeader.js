import Flag from 'react-world-flags'
import { ReactComponent as CyberIoT } from '../../../../../public/assets/icons/cyber-iot.svg'

const MapHeader = ({ country }) => {
  return (
    <div className="p-6 bg-cb-gray-600 rounded-lg flex flex-col gap-3 sm:flex-row justify-between">
      <div className="flex items-center gap-3">
        <CyberIoT />
        <div>
          <div className="text-white text-3xl font-bold">Cyber IoT</div>
          <div className="text-cb-green text-lg">Zigbee</div>
        </div>
      </div>
      <div className="self-end sm:self-auto flex items-center gap-3">
        <div className="h-2/3 aspect-square overflow-hidden relative">
          <Flag
            code={country.code}
            className="absolute w-full h-full top-0 left-0 object-contain"
          />
        </div>
        <div>
          <div className="font-bold text-lg text-white">{country.name}</div>
        </div>
      </div>
    </div>
  )
}

export default MapHeader

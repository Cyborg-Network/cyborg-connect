import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge'
import arrowDown from '../../../../../public/assets/icons/arrow-circled-down.png'
import arrowUp from '../../../../../public/assets/icons/arrow-circled-up.png'

function GaugeDisplay({
  percentage,
  fill,
  name,
  styleAdditions,
  selectedGauge,
  setAsSelectedGauge,
}) {
  const onMouseDownHandler = () => {
    setAsSelectedGauge(name, fill)
  }

  console.log(percentage, fill, name)
  return (
    //Using mousedown events instead of onclick events on "unimportant" clicks, as feedback is immediate => better UX
    <div
      onMouseDown={() => onMouseDownHandler()}
      className={`${
        name === selectedGauge.name
          ? 'bg-cb-gray-400 border border-cb-green'
          : ''
      } bg-cb-gray-600 rounded-lg relative`}
    >
      <div className="flex items-center p-2 gap-4 absolute top-4 left-4">
        {' '}
        <div
          className={`w-3 h-3 ring-4 ring-opacity-15 rounded-full ${styleAdditions}`}
        ></div>
        <div>
          <h5>{name + ' Usage'}</h5>
        </div>
      </div>
      <div className="h-80 p-2 text-white">
        <Gauge
          value={percentage}
          startAngle={-110}
          endAngle={110}
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 40,
              transform: 'translate(0px, 0px)',
              fill: 'white',
            },
            [`& .${gaugeClasses.valueArc}`]: {
              fill: `${fill}`,
            },
          }}
          text={({ value }) => `${value} %`}
        />
      </div>
      <div
        className={`${
          name === selectedGauge.name ? 'bg-cb-green' : 'bg-cb-gray-400'
        } w-full flex gap-2 text-lg justify-center items-center h-12 rounded-b-lg`}
      >
        <div>View Details</div>
        <img src={name === selectedGauge.name ? arrowUp : arrowDown} />
      </div>
    </div>
  )
}

export default GaugeDisplay

import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge'
import arrowDown from '../../../../../public/assets/icons/arrow-circled-down.png'
import arrowUp from '../../../../../public/assets/icons/arrow-circled-up.png'
import React from 'react'

interface GaugeDisplayProps {
  percentage: number
  fill: string
  name: string
  styleAdditions: string
  selectedGauge: { name: string }
  setAsSelectedGauge: (name: string, fill: string) => void
}

const GaugeDisplay: React.FC<GaugeDisplayProps> = ({
  percentage,
  fill,
  name,
  styleAdditions,
  selectedGauge,
  setAsSelectedGauge,
}: GaugeDisplayProps) => {
  const onMouseDownHandler = () => {
    setAsSelectedGauge(name, fill)
  }

  //console.log(percentage, fill, name)

  return (
    //Using mousedown events instead of onclick events on "unimportant" clicks, as feedback is immediate => better UX
    <div
      onMouseDown={() => onMouseDownHandler()}
      className={`${
        name === selectedGauge.name
          ? 'bg-color-background-4 border border-color-foreground'
          : ''
      } bg-color-background-2 rounded-lg relative hover:cursor-pointer`}
    >
      <div className="flex items-center p-2 gap-4 absolute top-4 left-4">
        {' '}
        <div
          className={`w-3 h-3 ring-4 ring-opacity-15 rounded-full ${styleAdditions}`}
        ></div>
        <div>
          <h5 className='text-color-text-2'>{name + ' Usage'}</h5>
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
          name === selectedGauge.name ? 'bg-color-foreground' : 'bg-color-background-4'
        } w-full flex gap-2 text-lg justify-center items-center h-12 rounded-b-lg`}
      >
        <div className={name === selectedGauge.name ? "text-color-text-1" : "text-color-text-2"}>View Details</div>
        <img
          alt="Gauge Details"
          className={name === selectedGauge.name ? "text-color-text-1" : "text-color-text-2"}
          src={name === selectedGauge.name ? arrowDown : arrowUp}
        />
      </div>
    </div>
  )
}

export default GaugeDisplay

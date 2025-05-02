import deployment from '../../../../../public/assets/icons/deployment-type.png'
import id from '../../../../../public/assets/icons/id.png'
import earnings from '../../../../../public/assets/icons/earnings.png'
import React from 'react'

export const NodeInformation: React.FC = () => {
  const itemData = [
    { name: 'Total Earnings', value: '$3000', icon: earnings },
    { name: 'Provider ID', value: '#CN12001', icon: id },
    { name: 'Deployment Type', value: 'K3S Worker', icon: deployment },
  ]

  function InformationItem({ name, value, icon }) {
    return (
      <div className="bg-cb-gray-600 rounded-lg flex justify-between p-6">
        <div className="flex flex-col gap-4">
          <div className="text-2xl">{name}</div>
          <div className="text-3xl">{value}</div>
        </div>
        <img className="h-full aspect-square" src={icon} />
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-evenly gap-10">
      {itemData.map(({ name, value, icon }, index) => (
        <InformationItem key={index} name={name} value={value} icon={icon} />
      ))}
    </div>
  )
}

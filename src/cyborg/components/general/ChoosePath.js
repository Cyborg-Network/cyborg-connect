import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './buttons/Button'
import { ROUTES } from '../../../index'

function ChoosePath() {
  const [path, setPath] = useState(null)

  const navigate = useNavigate()

  const handleClick = () => {
    if (path === 'provide-compute') {
      navigate(ROUTES.PROVIDE_COMPUTE)
    } else if (path === 'access-compute') {
      navigate(ROUTES.ACCESS_COMPUTE)
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="text-white text-3xl font-bold mb-2">Choose Your Path</div>
      <div className="flex gap-4">
        <Button
          onClick={() => {
            return /* setPath('provide-compute') */
          }}
          selectable
          isSelected={path === 'provide-compute' ? true : false}
          variation="inactive"
          additionalClasses={'relative py-6'}
        >
          <div className="font-bold">Provide Compute</div>
          <div className="text-xs absolute bottom-2 left-1/2 transform -translate-x-1/2">
            Coming Soon
          </div>
        </Button>
        <Button onClick={() => setPath('access-compute')} selectable isSelected={path === 'access-compute' ? true : false} variation="secondary">
          Access Compute
        </Button>
      </div>
      <Button onClick={handleClick} variation="primary">
        Get Started
      </Button>
    </div>
  )
}

export default ChoosePath

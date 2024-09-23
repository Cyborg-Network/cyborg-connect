import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './buttons/Button'
import { ROUTES } from '../../../index'

function ChoosePath() {
  const [path, setPath] = useState(null)

  const navigate = useNavigate()

  const handleClick = () => {
    console.log('click')
    if (path === 'provide-compute') {
      navigate(ROUTES.PROVIDE_COMPUTE)
    } else if (path === 'access-compute') {
      navigate(ROUTES.ACCESS_COMPUTE)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-white">Choose Your Path</h1>
      <div className="flex">
        <Button
          onClick={() => {
            return /*setPath('provide-compute')*/
          }}
          variation="inactive"
          additionalClasses={'relative'}
        >
          <div className="font-bold">Provide Compute</div>
          <div className="text-xs absolute bottom-2 left-1/2 transform -translate-x-1/2">
            Coming Soon
          </div>
        </Button>
        <Button onClick={() => setPath('access-compute')} variation="secondary">
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

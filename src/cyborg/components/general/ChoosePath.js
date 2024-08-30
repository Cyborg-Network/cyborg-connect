import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './Button'
import { useCyborg, DASH_STATE } from '../../CyborgContext'

function ChoosePath() {
  const [path, setPath] = useState(null)

  const { toggleDashboard } = useCyborg()
  const navigate = useNavigate()

  const handleClick = () => {
    console.log('click')
    if (path === 'provide-compute') {
      navigate('provide-compute')
    } else if (path === 'access-compute') {
      toggleDashboard({ section: DASH_STATE.HOME })
      navigate('access-compute')
    }
  }

  return (
    <div className="h-screen bg-cb-gray-700 flex flex-col items-center justify-center">
      <h1 className="text-white">Choose Your Path</h1>
      <div className="flex">
        <Button
          onClick={() => {return /*setPath('provide-compute')*/}}
          variation="inactive"
        >
          Provide Compute
        </Button>
        <Button
          onClick={() => setPath('access-compute')}
          variation="secondary"
        >
          Access Compute
        </Button>
      </div>
      <Button 
        onClick={handleClick} 
        variation="primary" 
      >
        Get Started
      </Button>
    </div>
  )
}

export default ChoosePath

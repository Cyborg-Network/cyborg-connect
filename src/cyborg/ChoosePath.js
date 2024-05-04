import React from 'react'

function ServiceButton({name}) {
    return (
        <button className='size-30 border border-cb-gray-400 text-white py-6 px-10 rounded-md hover:border-cb-green m-2 focus:border-cb-green focus:bg-cb-gray-400'>{name}</button>
    )
}

function SubmitButton() {
    return (
        <button className='size-30 text-white py-3 px-6 rounded-md hover:border-cb-green m-2 focus:border-cb-green bg-cb-green focus:bg-cb-gray-400'>Get Started</button>
    )
}

function ChoosePath() {
  return (
    <div className='h-screen bg-cb-gray-700 flex flex-col items-center justify-center'>
    <h1 className='text-white'>Choose Your Path</h1>
    <div className='flex'>
        <ServiceButton name={'Provide Compute'} />
        <ServiceButton name={'Access Compute'} />
    </div>
    
    <SubmitButton />
</div>
  )
}

export default ChoosePath
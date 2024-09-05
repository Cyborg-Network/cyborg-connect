import React from 'react'
import { useCyborg } from './CyborgContext'
function ServiceButton({name, setPath }) {
    return (
        <button onClick={()=>setPath()}
         className='size-30 border border-cb-gray-400 text-white py-6 px-10 rounded-md hover:border-cb-green m-2 focus:border-cb-green focus:bg-cb-gray-400'>{name}</button>
    )
}

function SubmitButton() {
    return (
        <button className='size-30 text-black py-3 px-6 rounded-md hover:border-cb-green m-2 focus:border-cb-green bg-cb-green focus:bg-cb-gray-400'>Get Started</button>
    )
}

function ChoosePath() {
    const { accessCompute/*, provideCompute */} = useCyborg()
    // const [ path, setPath ] = useState(null)
  return (
    <div className='h-screen bg-cb-gray-700 flex flex-col items-center justify-center'>
    <h1 className='text-white'>Choose Your Path</h1>
    <div className='flex'>
        <button className='bg-cb-gray-400 size-30 text-gray-500 py-6 px-10 rounded-md m-2 border border-gray-500 grid gap-1'>
            <div>Provide Compute</div>
            <div className='text-sm'>Coming Soon</div>
        </button>
        <ServiceButton name={'Access Compute'} setPath={accessCompute} />
    </div>
    
    <SubmitButton />
</div>
  )
}

export default ChoosePath

import React from 'react'
import { Dimmer } from 'semantic-ui-react'
import { SERVICES, useCyborg } from '../../../CyborgContext'
function UploadDockerImgURL({setService}) {
  const { selectService } = useCyborg()
  return (
      <Dimmer active >
          
          <form className="bg-cb-gray-700 rounded-lg p-20">
            <h5 className='flex'>Upload Docker Image</h5>
            <div className="mb-4">
              <label htmlFor="url" className="flex text-white text-sm font-bold py-4 mb-2">Docker image URL</label>
              <input type="url" id="url" name="url" className="focus:border-cb-green text-cb-gray-600 border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <div className=" flex items-center justify-between">
                <button onClick={()=>setService(null)}
                  className="bg-cb-gray-600 w-full hover:ring-2 ring-cb-gray-500 text-white py-2 rounded">Close</button>
              </div>
              <div className=" flex items-center justify-between">
                <button onClick={()=>selectService(SERVICES.CYBER_DOCK)} 
                  className="bg-cb-green w-full hover:ring-2 ring-white  text-black py-2 rounded">Submit</button>
              </div>
            </div>
          </form>

      </Dimmer>
  )
}

export default UploadDockerImgURL
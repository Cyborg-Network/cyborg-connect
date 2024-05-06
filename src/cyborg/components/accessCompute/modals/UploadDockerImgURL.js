import React from 'react'
import { Dimmer } from 'semantic-ui-react'

function UploadDockerImgURL() {
  return (
    // <div>
        <Dimmer active>
            
            <form className="max-w-md mx-auto mt-8 bg-cb-gray-700 rounded-sm p-20">
              <h5>Upload Docker Image</h5>
              <div className="mb-4">
                <label htmlFor="email" className="block text-white text-sm font-bold mb-2">Docker image URL</label>
                <input type="email" id="email" name="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div className=" flex items-center justify-between">
                <button type="submit" className="bg-cb-green hover:ring-4 ring-black  text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
              </div>
            </form>

        </Dimmer>
    // </div>
  )
}

export default UploadDockerImgURL
import React, {useState} from 'react'
import { Dimmer } from 'semantic-ui-react'
import { SERVICES, useCyborg } from '../../../CyborgContext'
import { useSubstrateState } from '../../../../substrate-lib'
import { web3FromSource } from '@polkadot/extension-dapp'

function UploadDockerImgURL({setService}) {
  const { selectService } = useCyborg()
  const { api, currentAccount } = useSubstrateState()
  const [url,setUrl] = useState('')

  const getFromAcct = async () => {
    const {
      address,
      meta: { source, isInjected },
    } = currentAccount

    if (!isInjected) {
      return [currentAccount]
    }

    // currentAccount is injected from polkadot-JS extension, need to return the addr and signer object.
    // ref: https://polkadot.js.org/docs/extension/cookbook#sign-and-send-a-transaction
    const injector = await web3FromSource(source)
    return [address, { signer: injector.signer }]
  }
  const handleUrlChange = (e) => {
    setUrl(e.target.value)
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    selectService(SERVICES.CYBER_DOCK)
    console.log("url: ". url)
    const fromAcct = await getFromAcct()
    const containerTask = api.tx.workerRegistration.taskScheduler(url)
    const hash = await containerTask.signAndSend(...fromAcct);
    console.log("hash: ", hash)
  }
  return (
      <Dimmer active >
          
          <form onSubmit={handleSubmit}  className="bg-cb-gray-700 rounded-lg p-20">
            <h5 className='flex'>Upload Docker Image</h5>
            <div className="mb-4">
              <label htmlFor="url" className="flex text-white text-sm font-bold py-4 mb-2">Docker image URL</label>
              <input type="text" id="url" name="url" onChange={handleUrlChange} className="focus:border-cb-green text-cb-gray-600 border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <div className=" flex items-center justify-between">
                <button onClick={()=>setService(null)}
                  className="bg-cb-gray-600 w-full hover:ring-2 ring-cb-gray-500 text-white py-2 rounded">Close</button>
              </div>
              <div className=" flex items-center justify-between">
                <button type="submit" 
                  className="bg-cb-green w-full hover:ring-2 ring-white  text-black py-2 rounded">Submit</button>
              </div>
            </div>
          </form>

      </Dimmer>
  )
}

export default UploadDockerImgURL
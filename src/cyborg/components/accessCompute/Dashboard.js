import React from 'react'
import nondeployed from '../../../../public/assets/icons/nondeployed.png' 
import deploymentsTab from '../../../../public/assets/icons/deployment-logo.png' 
import { FiPlusCircle } from "react-icons/fi";

function AddNodeButton() {
    return (
        <button className='flex items-center gap-1 size-30 text-white py-3 px-6 rounded-md bg-cb-green focus:bg-cb-gray-400'>
            <FiPlusCircle size={18} /> Add Node</button>
    )
}
function NoNodes() {
    return (
        <div className='flex flex-col justify-center h-2/3 items-center'>
            <a className=''>
                <img src={nondeployed} />
            </a>
            <div className='text-white flex flex-col'>
                <p>Currently, you don't have any nodes.</p>
                <button className='hover:text-cb-green'><u>Add your first node</u></button>
            </div>
        </div>
    )
}
// function NodeList() {
//     return (
//         <div className='flex w-full text-white text-opacity-70'>
//             <div className='flex justify-between w-full items-center'>
//                 <h5>Name</h5>
//                 <h5>Type</h5>
//                 <h5>Location</h5>
//             </div>
//             <div>

//             </div>
//         </div>
//     )
// }
function Dashboard() {
  return (
    <div className='h-screen bg-cb-gray-700 flex flex-col '>
        <div className='flex items-center justify-between mx-2 text-white'>
            <div className='flex items-center'>
                <img src={deploymentsTab} />
                <div>
                    <h3 className='mb-0'>Deployments</h3>
                    <p className='text-white text-opacity-70'>Dashboard / Node List</p>
                </div>
            </div>
            <AddNodeButton />
        </div>
        {/* <NodeList /> */}
        <NoNodes />
    </div>
  )
}

export default Dashboard
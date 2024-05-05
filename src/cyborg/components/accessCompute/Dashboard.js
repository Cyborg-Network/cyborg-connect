import React from 'react'
// import nondeployed from '../../../../public/assets/icons/nondeployed.png' 
import deploymentsTab from '../../../../public/assets/icons/deployment-logo.png' 
import cyberdock from '../../../../public/assets/icons/cyberdockDash.png' 
import { FiPlusCircle } from "react-icons/fi";

function AddNodeButton() {
    return (
        <button className='flex items-center gap-1 size-30 text-white py-3 px-6 rounded-md bg-cb-green focus:bg-cb-gray-400'>
            <FiPlusCircle size={18} /> Add Node</button>
    )
}
// function NoNodes() {
//     return (
//         <div className='flex flex-col justify-center h-2/3 items-center'>
//             <a className=''>
//                 <img src={nondeployed} />
//             </a>
//             <div className='text-white flex flex-col'>
//                 <p>Currently, you don't have any nodes.</p>
//                 <button className='hover:text-cb-green'><u>Add your first node</u></button>
//             </div>
//         </div>
//     )
// }
function NodeList() {
    return (
        <div className='flex flex-col w-full text-white text-opacity-70 '>
            <span className='flex w-5/6 py-2 px-5'>
                <ul className='grid grid-cols-3 w-full'>
                    <li>Name</li>
                    <li>Type</li>
                    <li>Location</li>
                </ul>
            </span>
            <div className='bg-white bg-opacity-10 m-4 rounded-lg'>
                <span className='flex justify-between w-5/6 items-center py-4 px-5'>
                    <ul className='grid grid-cols-3 w-full items-center'>
                        <li className='flex items-center gap-3'>
                            <a>
                                <img src={cyberdock} />
                            </a>
                            <div>
                                <h3 className='mb-0'>Cyber Dock</h3>
                                <p className='mt-0 text-lg'>Zigbee</p>
                            </div>
                        </li>
                        <li>Master</li>
                        <li>Austin, Texas</li>
                    </ul>
                </span>
            </div>
        </div>
    )
}
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
        <NodeList />
        {/* <NoNodes /> */}
    </div>
  )
}

export default Dashboard
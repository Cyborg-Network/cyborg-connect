import React from 'react'
import ReactDOM from 'react-dom'
import './index.css' 
import { Main } from './App'
import { createBrowserRouter, RouterProvider, Outlet, Link } from 'react-router-dom';
import { SubstrateContextProvider } from './substrate-lib'
import { CyborgContextProvider } from './cyborg/CyborgContext'
import { Toaster } from 'react-hot-toast'
import RpcSelector from './cyborg/components/general/RpcSelector'
import Dashboard from './cyborg/components/general/dashboard/Dashboard'
import SideBar from './cyborg/components/general/layouts/SideBar'
import ChooseServices from './cyborg/components/accessCompute/ChooseServices'
import ChoosePath from './cyborg/components/general/ChoosePath'
import { AccountContextProvider } from './cyborg/context/AccountContext';
import ComputeStatus from './cyborg/components/general/compute-status/ComputeStatus';

const COMPONENT_ROUTES = {
  CHOOSE_PATH: "cyborg-connect",
  PROVIDE_COMPUTE: "cyborg-connect/provide-compute",
  CHOOSE_SERVICES: "cyborg-connect/access-compute",
  DASHBOARD: "cyborg-connect/access-compute/dashboard",
  COMPUTE_STATUS: "cyborg-connect/access-compute/dashboard/compute-status/:nodeId",
  DEV_MODE: "cyborg-connect/dev-mode",
}

const Layout = () => {
  return (
    <>
      <Outlet />
      <div className='fixed -bottom-2 left-1/2 transform -translate-x-1/2 z-30'><RpcSelector /></div>
      <Link to={"cyborg-connect/dev-mode"}>
        <button className='fixed text-lg rounded-lg p-4 bottom-2 right-2 z-40 bg-white'>Test Substrate Chain</button>
      </Link>
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: COMPONENT_ROUTES.CHOOSE_PATH,
        element: <ChoosePath />,
      },
      {
        element: <SideBar />,
        children: [
          {
            path: COMPONENT_ROUTES.PROVIDE_COMPUTE,
            element: <Dashboard />,
          },
          {
            path: COMPONENT_ROUTES.DASHBOARD,
            element: <Dashboard />,
          },
          {
            path: COMPONENT_ROUTES.COMPUTE_STATUS,
            element: <ComputeStatus />,
          }
        ]
      },
      {
        path: COMPONENT_ROUTES.CHOOSE_SERVICES,
        element: <ChooseServices />,
      },
    ]
  },
  {
        path: COMPONENT_ROUTES.DEV_MODE,
        element: <Main />
  }
]);

ReactDOM.render(
  <React.StrictMode>
    <SubstrateContextProvider>
      <AccountContextProvider>
        <CyborgContextProvider>
          <Toaster
            position="top-center"
            reverseOrder={false}
          />
          <RouterProvider router={router} />
        </CyborgContextProvider>
      </AccountContextProvider>
    </SubstrateContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

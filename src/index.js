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

export const ROUTES = {
  CHOOSE_PATH: "/cyborg-connect",
  PROVIDE_COMPUTE: "/cyborg-connect/provide-compute",
  ACCESS_COMPUTE: "/cyborg-connect/access-compute",
  DASHBOARD: "/cyborg-connect/access-compute/dashboard",
  COMPUTE_STATUS: "/cyborg-connect/access-compute/dashboard/compute-status",
  DEV_MODE: "/cyborg-connect/dev-mode",
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
        path: ROUTES.CHOOSE_PATH,
        element: <ChoosePath />,
      },
      {
        element: <SideBar />,
        children: [
          {
            path: ROUTES.PROVIDE_COMPUTE,
            element: <Dashboard />,
          },
          {
            path: ROUTES.DASHBOARD,
            element: <Dashboard />,
          },
          {
            path: `${ROUTES.COMPUTE_STATUS}/:domain`,
            element: <ComputeStatus />,
          }
        ]
      },
      {
        path: ROUTES.ACCESS_COMPUTE,
        element: <ChooseServices />,
      },
    ]
  },
  {
        path: ROUTES.DEV_MODE,
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

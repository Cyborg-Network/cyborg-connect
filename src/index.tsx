import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' 
import { Main } from './App'
import { 
  createBrowserRouter, 
  RouterProvider, 
  Outlet, 
  Link, 
  useLocation 
} from 'react-router-dom';
import { SubstrateContextProvider } from './substrate-lib'
import { CyborgContextProvider } from './cyborg/CyborgContext'
import { Toaster } from 'react-hot-toast'
//import RpcSelector from './cyborg/components/general/RpcSelector'
import Dashboard from './cyborg/components/general/dashboard/Dashboard';
import SideBar from './cyborg/components/general/layouts/SideBar';
import ChooseServices from './cyborg/components/accessCompute/ChooseServices'
import ChoosePath from './cyborg/components/general/ChoosePath'
import { AccountContextProvider } from './cyborg/context/AccountContext';
import ComputeStatus from './cyborg/components/general/compute-status/ComputeStatus';
import PageNotFound from './cyborg/components/general/PageNotFound';
import PageWrapper from './cyborg/components/general/layouts/page-wrapper/PageWrapper';
import { UiContextProvider } from './cyborg/context/UiContext';
import MapInteractor from './cyborg/components/general/map/MapInteractor';
import SelectNodePage from './cyborg/components/accessCompute/select-node/SelectNode';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const ROUTES = {
  CHOOSE_PATH: "/",
  PROVIDE_COMPUTE: "/provide-compute",
  ACCESS_COMPUTE: "/access-compute",
  DASHBOARD: "/access-compute/dashboard",
  COMPUTE_STATUS: "/access-compute/dashboard/compute-status",
  DEV_MODE: "/dev-mode",
  MAP: "/access-compute/map",
  MODAL_NODES: "/access-compute/modal-nodes",
}

const GlobalLayout = () => {
  const location = useLocation().pathname;

  const linkProperties = location === ROUTES.DEV_MODE ? 
    {
      route: ROUTES.CHOOSE_PATH,
      name: "Test Cyborg DApp",
    }
    :
    {
      route: ROUTES.DEV_MODE,
      name: "Test Chain",
    }

  return (
    <>
      <Outlet />
      {/*<div className='fixed bottom-2 left-2 md:left-1/2 transform md:-translate-x-1/2 z-30'><RpcSelector /></div>*/}
      <Link to={linkProperties.route}>
        <button className='fixed rounded-lg p-4 bottom-2 right-2 z-40 bg-white text-black border border-black'>{linkProperties.name}</button>
      </Link>
    </>
  )
}

const CyborgLayout = () => {
  return(
    <>
      <PageWrapper>
        <Outlet />
      </PageWrapper>
    </>
  )
}

console.log(process.env.REACT_APP_ENV)

const router = createBrowserRouter([
  {
    element: <GlobalLayout />,
    children: [
      {
        element: <CyborgLayout />,
        children: [
          {
            path: ROUTES.ACCESS_COMPUTE,
            element: <ChooseServices />,
          },
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
                element: <ComputeStatus perspective='accessor' />,
              },
              {
                path: `${ROUTES.MAP}`,
                element: <MapInteractor />,
              },
              {
                path: `${ROUTES.MODAL_NODES}`,
                element: <SelectNodePage />,
              },
              {
                path: ROUTES.DASHBOARD,
                element: <Dashboard />,
              },
              {
                path: `${ROUTES.COMPUTE_STATUS}/:domain`,
                element: <ComputeStatus perspective='accessor'/>,
              },
              {
                path: `${ROUTES.MAP}`,
                element: <MapInteractor />,
              },
              {
                path: `${ROUTES.MODAL_NODES}`,
                element: <SelectNodePage />,
              }
            ]
          },
        ]
      },
      {
        path: ROUTES.DEV_MODE,
        element: <Main />
      }
    ]
  },
  {
    path: '*',
    element: <PageNotFound />,
  }
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 3,
    }
  }
})

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <SubstrateContextProvider>
      <AccountContextProvider>
        <CyborgContextProvider>
          <UiContextProvider>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
                style: {
                  background: 'var(--cb-gray-600)',
                  color: 'white',
                  border: '1px solid var(--cb-green)'
                }
              }}
          />
          <RouterProvider router={router} />
          </UiContextProvider>
        </CyborgContextProvider>
      </AccountContextProvider>
    </SubstrateContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
)

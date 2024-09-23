import React from 'react'
import logo from '../../../../../public/assets/Logo.png'
import profile from '../../../../../public/assets/icons/profile.png'
import { IoMenu } from 'react-icons/io5'
import { BsThreeDots } from 'react-icons/bs'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../..'
import { useUi } from '../../../context/UiContext'

function NavigationTab({ name, trigger }) {
  return (
    <button
      onClick={() => trigger()}
      className="flex items-center text-black py-3 px-24 rounded-md bg-cb-green focus:bg-cb-gray-400"
    >
      {name}
    </button>
  )
}

function ServiceTab({ name }) {
  return (
    <button className="flex justify-center text-white text-opacity-50 py-3 rounded-md focus:text-black focus:bg-cb-green bg-cb-gray-700">
      {name}
    </button>
  )
}

function SideBar() {
  const navigate = useNavigate()
  const { sidebarIsActive, setSidebarIsActive } = useUi()

  const navigateAndCloseSidebar = url => {
    setSidebarIsActive(false)
    navigate(url)
  }

  const returnSidebarClass = sidebarIsActive ? '' : '-translate-x-full'
  const returnButtonClass = sidebarIsActive
    ? '-translate-x-0'
    : 'translate-x-20'

  return (
    <>
      <div
        className={`w-80 fixed left-0 top-0 flex flex-col bg-cb-gray-600 h-screen justify-between transform ${returnSidebarClass} transition-transform duration-500 z-50`}
      >
        <div>
          <span className="flex items-center justify-between p-4 pr-6">
            <div className="flex gap-4 items-center flex-shrink-0">
              <button></button>
              <Link href={ROUTES.CHOOSE_PATH}>
                <img src={logo} className="h-10S" />
              </Link>
            </div>
            <div
              onClick={() => setSidebarIsActive(!sidebarIsActive)}
              className={`hover:cursor-pointer absolute right-4 transform ${returnButtonClass} transition-transform duration-500 border border-cb-gray-400 flex items-center justify-center size-10 bg-cb-gray-700 rounded-md`}
            >
              <IoMenu size={27} color="gray" />
            </div>
          </span>
          <span className="flex flex-col items-center my-6">
            <NavigationTab
              name={'Dashboard'}
              trigger={() => navigateAndCloseSidebar(ROUTES.DASHBOARD)}
            />
          </span>
        </div>
        <div>
          <span className="text-white">
            <ul className="flex flex-col gap-6 p-10">
              <li>Docs</li>
              <li>Community</li>
              <li>Help</li>
            </ul>
          </span>
          <span className="flex flex-col p-4 bg-cb-gray-700 m-4 rounded-md">
            <div className="flex justify-between items-center pb-6">
              <div className="flex mx-4">
                <a>
                  <img src={profile} className="h-10S" />
                </a>
                <button className="text-white">Profile</button>
              </div>
              <BsThreeDots size={20} color={'gray'} />
            </div>
            <div className="grid grid-cols-2 border border-cb-gray-500 rounded-md p-1">
              <ServiceTab name="Provider" />
              <ServiceTab name="User" />
            </div>
          </span>
        </div>
      </div>
      {/*Invisible overlay for the sidebar so that clicks beside it can also deactivate it*/}
      <div
        className={`fixed top-0 left-0 w-screen h-screen lg:hidden z-40 ${
          sidebarIsActive ? '' : 'hidden'
        }`}
        onMouseDown={() => setSidebarIsActive(!sidebarIsActive)}
      />
      <Outlet />
    </>
  )
}

export default SideBar

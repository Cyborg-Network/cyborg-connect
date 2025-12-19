import React from 'react'
import logo from '../../../public/assets/Logo.png'
import profile from '../../../public/assets/icons/profile.png'

const Header = () => {
  return (
    <div className="flex gap-10 lg:gap-20 justify-between bg-color-background-1 border-b border-color-background-4 py-4">
      <div className="flex gap-4 items-center flex-shrink-0">
        <button></button>
        <a href="/cyborg-connect">
          <img src={logo} className="h-10S" />
        </a>
      </div>
      <div className="flex mx-4">
        <a>
          <img src={profile} className="h-10S" />
        </a>
        <button className="text-white">Profile</button>
      </div>
    </div>
  )
}

export default Header

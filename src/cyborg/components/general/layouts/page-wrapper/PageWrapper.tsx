import React from 'react'
import './PageWrapper.styles.css'

const PageWrapper = ({ children }) => {
  return (
    <div className="h-screen w-screen">
      <div className="-z-50 h-screen w-screen fixed left-0 top-0 bg-color-background-1" />
      <div className="-z-30 h-full aspect-square fixed rounded-full background-1" />
      <div className="-z-30 h-2/3 aspect-square fixed rounded-full background-1" />
      <div className="-z-20 h-5/6 aspect-square rounded-full fixed background-2" />
      <div className="-z-20 h-4/5 aspect-square rounded-full fixed background-2" />
      <div className="-z-20 h-4/5 aspect-square rounded-full fixed background-3" />
      <div className="-z-20 h-4/5 aspect-square rounded-full fixed background-4" />
      <div className="-z-20 h-4/5 aspect-square rounded-full fixed background-5" />
      <div className="-z-20 h-4/5 aspect-square rounded-full fixed background-6" />
      <div className="fixed -z-10 h-screen w-screen backdrop-blur-3xl" />
      <div className="min-h-screen w-screen overflow-auto grid items-center justify-center absolute z-0">
        {children}
      </div>
    </div>
  )
}

export default PageWrapper

import React from 'react'

const PageWrapper = ({ children }) => {
  return (
    <div className="min-h-screen w-screen overflow-auto bg-cb-gray-700 grid items-center justify-center">
      {children}
    </div>
  )
}

export default PageWrapper

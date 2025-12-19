import React from 'react'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  onOutsideClick: () => void
  additionalClasses?: String
}

const Modal: React.FC<Props> = ({
  children,
  onOutsideClick,
  additionalClasses,
}) => {
  //alignment should be either 'items-center' or undefined, this will be better with ts
  return (
    <div
      className="fixed bg-gray-400 backdrop-blur-lg bg-opacity-5 h-full w-full left-0 top-0 z-50 grid justify-center items-center overflow-y-auto"
      onClick={onOutsideClick}
    >
      <div
        className={`${additionalClasses} fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-color-background-1 2xl:w-1/5 xl:w-2/5 lg:w-3/5 sm:w-1/2 w-5/6 rounded-lg p-16`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal

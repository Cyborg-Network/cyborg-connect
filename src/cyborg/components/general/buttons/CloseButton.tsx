import React from 'react'
import { IoClose } from 'react-icons/io5'

interface Props {
  type: 'submit' | 'reset' | 'button'
  onClick: () => void
  additionalClasses?: String
}

// Separate from the regular, abstract Button.js, so that it doesn't have to import the IoClose icon even though it might not need it
const CloseButton: React.FC<Props> = ({
  type,
  onClick,
  additionalClasses,
}: Props) => {
  return (
    <button
      type={type}
      onClick={() => onClick()}
      className={`bg-color-background-4 rounded-full w-8 sm:w-10 aspect-square grid justify-center items-center ${additionalClasses}`}
    >
      <IoClose size={20} className="text-red-800 hover:text-red-500" />
    </button>
  )
}

export default CloseButton

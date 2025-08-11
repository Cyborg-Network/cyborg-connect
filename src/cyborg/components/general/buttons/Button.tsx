import React, { ReactNode, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import './Button.styles.css'

interface Props {
  variation: 'primary' | 'secondary' | 'cancel' | 'inactive' | 'warning'
  children: ReactNode
  type: 'submit' | 'reset' | 'button'
  onClick: (e: React.MouseEvent) => void
  additionalClasses?: String
  selectable: { isSelected: boolean } | false
}

//with ts, add exclusivity of either varation === "cancel"
const Button: React.FC<Props> = ({
  variation,
  children,
  type,
  onClick,
  additionalClasses,
  selectable,
}: Props) => {
  const [btnState, setBtnState] = useState('initial')

  let className: String
  let content: ReactNode

  const returnButtonClass = variation => {
    //Order is important here! Change with care
    if (selectable) {
      if (selectable.isSelected) {
        return `btn-${variation}-selected`
      }
    }

    if (btnState === 'btn-on') {
      return `btn-${variation}-on`
    }

    if (btnState === 'initial') {
      return ''
    }

    if (btnState === 'btn-off') {
      return `btn-${variation}-off`
    }
  }

  const handleMouseLeave = () => {
    if (selectable && !selectable.isSelected && btnState !== 'btn-off') {
      setBtnState('initial')
    } else {
      setBtnState('btn-off')
    }
  }

  switch (variation) {
    case 'primary':
      className = `size-30 text-black py-3 px-6 rounded-md btn-prim ${returnButtonClass(
        'prim'
      )} ${additionalClasses}`
      content = children
      break
    case 'secondary':
      className = `size-30 text-white py-3 px-6 rounded-md btn-sec ${returnButtonClass(
        'sec'
      )} ${additionalClasses}`
      content = children
      break
    case 'cancel':
      className = `bg-cb-gray-400 rounded-full w-8 sm:w-10 aspect-square grid justify-center items-center hover:text-cb-green ${additionalClasses}`
      content = <IoClose size={20} />
      break
    case 'warning':
      className = `size-30 border-red-500 border text-white py-3 px-6 rounded-md btn-warn ${returnButtonClass(
        'warn'
      )} ${additionalClasses}`
      content = children
      break
    case 'inactive':
      className = `bg-cb-gray-400 size-30 text-gray-500 py-3 px-6 rounded-md border border-gray-500 ${additionalClasses}`
      content = children
      break
    default:
      className = ''
  }

  return (
    <button
      type={type}
      onMouseEnter={() => setBtnState('btn-on')}
      onMouseLeave={() => handleMouseLeave()}
      onClick={e => onClick(e)}
      className={`${className}`}
    >
      {content}
    </button>
  )
}

export default Button

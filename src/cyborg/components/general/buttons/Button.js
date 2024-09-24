import { useState } from 'react';
import { IoClose } from 'react-icons/io5'
import './Button.styles.css';

//with ts, add exclusivity of either varation === "cancel"
export default function Button({
  variation,
  children,
  type,
  onClick,
  additionalClasses,
}) {

  const [btnState, setBtnState] = useState('initial')

  let className
  let content

  switch (variation) {
    case 'primary':
      className =
        `size-30 text-black py-3 px-6 rounded-md btn-prim ${btnState === 'btn-on' && 'btn-prim-on'} ${btnState === 'btn-off' && 'btn-prim-off'}`
      content = children
      break
    case 'secondary':
      className =
        `size-30 text-white py-3 px-6 rounded-md btn-sec ${btnState === 'btn-on' && 'btn-sec-on'} ${btnState === 'btn-off' && 'btn-sec-off'}`
      content = children
      break
    case 'cancel':
      className =
        'bg-cb-gray-400 rounded-full w-8 sm:w-10 aspect-square grid justify-center items-center hover:text-cb-green'
      content = <IoClose size={20} />
      break
    case 'inactive':
      className =
        'bg-cb-gray-400 size-30 text-gray-500 py-3 px-6 rounded-md border border-gray-500'
      content = children
      break
    default:
      className = ''
  }

  return (
    <button
      onMouse
      type={type}
      onMouseEnter={() => setBtnState(btnState => 'btn-on')}
      onMouseLeave={() => setBtnState(btnState => 'btn-off')}
      onClick={() => onClick()}
      className={`${className} ${additionalClasses}`}
    >
      {content}
    </button>
  )
}

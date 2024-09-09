import { IoClose } from 'react-icons/io5'

//with ts, add exclusivity of either varation === "cancel"
export default function Button({
  variation,
  children,
  type,
  onClick,
  additionalClasses,
}) {
  let className
  let content

  switch (variation) {
    case 'primary':
      className =
        'size-30 text-black py-3 px-6 rounded-md hover:border-cb-green m-2 focus:border-cb-green bg-cb-green focus:bg-cb-gray-400'
      content = children
      break
    case 'secondary':
      className =
        'size-30 border border-cb-gray-400 text-white py-6 px-10 rounded-md hover:border-cb-green m-2 focus:border-cb-green focus:bg-cb-gray-400'
      content = children
      break
    case 'cancel':
      className =
        'bg-cb-gray-400 rounded-full w-10 p-1.5 aspect-square grid justify-center items-center hover:text-cb-green'
      content = <IoClose size={20} />
      break
    case 'inactive':
      className =
        'bg-cb-gray-400 size-30 text-gray-500 py-6 px-10 rounded-md m-2 border border-gray-500'
      content = children
      break
    default:
      className = ''
  }

  return (
    <button
      type={type}
      onClick={() => onClick()}
      className={`${className} ${additionalClasses}`}
    >
      {content}
    </button>
  )
}

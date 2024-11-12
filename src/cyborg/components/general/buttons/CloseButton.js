import { IoClose } from 'react-icons/io5'

// Separate from the regular, abstract Button.js, so that it doesn't have to import the IoClose icon even though it might not need it
export default function CloseButton({ type, onClick, additionalClasses }) {
  return (
    <button
      type={type}
      onClick={() => onClick()}
      className={`bg-cb-gray-400 rounded-full w-8 sm:w-10 aspect-square grid justify-center items-center hover:text-red-400 ${additionalClasses}`}
    >
      <IoClose size={20} />
    </button>
  )
}

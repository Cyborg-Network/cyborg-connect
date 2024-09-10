export default function Modal({ children, onOutsideClick, additionalClasses }) {
  //alignment should be either 'items-center' or undefined, this will be better with ts
  return (
    <div
      className="fixed bg-gray-400 backdrop-blur-lg bg-opacity-5 h-full w-full left-0 top-0 z-50 grid justify-center items-center"
      onClick={onOutsideClick}
    >
      <div
        className={`${additionalClasses} max-h-screen overflow-y-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-cb-gray-700 2xl:w-1/5 xl:w-2/5 lg:w-3/5 sm:w-1/2 w-11/12 rounded-lg p-6 md:p-16`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

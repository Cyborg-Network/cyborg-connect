export const Separator = ({ colorClass, additionalStyles }) => (
  //Tailwind doesn't have 1px as h attribute and it isn't used anywhere else so I used inline
  <div
    style={{ height: '1px' }}
    className={`w-full rounded-xl ${colorClass} ${additionalStyles}`}
  />
)

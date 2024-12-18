import NodeCard from './NodeCard'

export function NodeList({ nodes, taskMetadata, isProvider }) {
  const lastTask = taskMetadata.taskId

  console.log('nodes: in list: ', nodes)
  console.log('lastTask: ', lastTask)

  return (
    <div className="flex flex-col w-full text-white text-opacity-70 ">
      <span
        className={`${nodes.length < 1 ? 'hidden' : ''} flex w-full py-2 px-5`}
      >
        <ul className="hidden lg:grid grid-cols-4 w-full">
          <li>Name / Address</li>
          <li>Type</li>
          <li>URL / IP</li>
          <li>Status</li>
        </ul>
      </span>
      <div className="grid gap-3 m-4 rounded-lg">
        {nodes.length > 0 &&
          nodes.map(item => (
            <NodeCard
              key={item.owner + item.id}
              item={item}
              lastTask={lastTask}
              isProvider={isProvider}
            />
          ))}
      </div>
    </div>
  )
}

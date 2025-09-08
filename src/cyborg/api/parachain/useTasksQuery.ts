import { useQuery } from '@tanstack/react-query'
import { TypedApi } from 'polkadot-api'
import { CyborgParachain } from '@polkadot-api/descriptors'
import { InjectedPolkadotAccount } from 'polkadot-api/dist/reexports/pjs-signer'
import { useParachain } from '../../context/PapiContext'

const getUserTasks = async (api: TypedApi<CyborgParachain>, account: InjectedPolkadotAccount): Promise<bigint[]> => {
  const allTasks = await api.query.TaskManagement.TaskOwners.getEntries();

  const userOwnedTasks = allTasks
    .filter(({ value }) => value === account.address)
    .map(({ keyArgs }) => keyArgs[0]); 

  console.log(`User Owned Tasks: ${userOwnedTasks}`)

  return userOwnedTasks
}

/* const getSingleTask = async (api: ApiPromise, taskId: number) => {
  return await api.query.taskManagement.tasks(taskId)
} */

export const useUserTasksQuery = () => {
  const { parachainApi, account } = useParachain()

  return useQuery({
    queryKey: ['userTasks'],
    enabled: !!(parachainApi && account),
    queryFn: () => getUserTasks(parachainApi, account),
  })
}

/* export const useSingleTaskQuery = (taskId: number) => {
  const { api, apiState } = useSubstrateState()

  return useQuery({
    queryKey: ['singleTask', taskId],
    enabled: !!(api && apiState === 'READY'),
    queryFn: () => getSingleTask(api, taskId),
  })
} */

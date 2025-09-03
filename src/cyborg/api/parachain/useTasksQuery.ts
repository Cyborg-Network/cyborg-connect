import { useSubstrateState } from '../../../substrate-lib/SubstrateContext'
import { useQuery } from '@tanstack/react-query'
import { TypedApi } from 'polkadot-api'
import { CyborgParachain } from '@polkadot-api/descriptors'
import { InjectedPolkadotAccount } from 'polkadot-api/dist/reexports/pjs-signer'

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
  const { api, apiState, currentAccount } = useSubstrateState()

  return useQuery({
    queryKey: ['userTasks'],
    enabled: !!(api && apiState === 'READY' && currentAccount),
    queryFn: () => getUserTasks(api, currentAccount),
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

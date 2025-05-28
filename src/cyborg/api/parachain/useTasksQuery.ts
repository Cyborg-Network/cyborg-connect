import { ApiPromise } from '@polkadot/api'
import { useSubstrateState } from '../../../substrate-lib/SubstrateContext'
import { useQuery } from '@tanstack/react-query'
import { AccountId32 } from '@polkadot/types/interfaces'
import { getAccount } from '../../util/getAccount'

const getUserTasks = async (api: ApiPromise, currentAccount: AccountId32) => {
  const allTasks = await api.query.taskManagement.taskOwners.entries()
  const userAccount = await getAccount(currentAccount)
  const userAddress = userAccount[0]

  const userOwnedTasks = allTasks.map(([key, value]) => {
    const currentTaskOwner = value.toHuman()

    if (currentTaskOwner === userAddress) {
      return parseInt(key.toHuman()[0])
    }
  })

  console.log(userOwnedTasks)

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

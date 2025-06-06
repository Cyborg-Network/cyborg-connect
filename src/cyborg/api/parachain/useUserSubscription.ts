import { ApiPromise } from '@polkadot/api'
import { useSubstrateState } from '../../../substrate-lib/SubstrateContext'
import { useQuery } from '@tanstack/react-query'
import { transformToNumber } from '../../util/numberOperations'

const getUserComputeHours = async (api: ApiPromise, account: any): Promise<number> => {
  return transformToNumber((await api.query.payment.computeHours(account.address)).toString())
}

export const useUserComputeHoursQuery = () => {
  const { api, apiState, currentAccount } = useSubstrateState()

  return useQuery({
    queryKey: ['userComputeHours'],
    enabled: !!(api && apiState === 'READY' && currentAccount),
    queryFn: () => getUserComputeHours(api, currentAccount),
  })
}
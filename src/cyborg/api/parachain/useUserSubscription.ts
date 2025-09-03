import { useSubstrateState } from '../../../substrate-lib/SubstrateContext'
import { useQuery } from '@tanstack/react-query'
import { transformToNumber } from '../../util/numberOperations'
import { TypedApi } from 'polkadot-api'
import { CyborgParachain } from '@polkadot-api/descriptors'
import { InjectedPolkadotAccount } from 'polkadot-api/pjs-signer'

const getUserComputeHours = async (api: TypedApi<CyborgParachain>, account: InjectedPolkadotAccount): Promise<number> => {
  return transformToNumber((await api.query.Payment.ComputeHours.getValue(account.address)).toString())
}

export const useUserComputeHoursQuery = () => {
  const { api, apiState, currentAccount } = useSubstrateState()

  return useQuery({
    queryKey: ['userComputeHours'],
    enabled: !!(api && apiState === 'READY' && currentAccount),
    queryFn: () => getUserComputeHours(api, currentAccount),
  })
}
import { useSubstrateState } from '../../../substrate-lib/SubstrateContext'
import { useQuery } from '@tanstack/react-query'
import { TypedApi } from 'polkadot-api'
import { CyborgParachain } from '@polkadot-api/descriptors'

const getComputeHourPrice = async (api: TypedApi<CyborgParachain>): Promise<bigint> => {
  return await api.query.Payment.SubscriptionFee.getValue()
}

export const usePriceQuery = () => {
  const { api, apiState } = useSubstrateState()

  return useQuery({
    queryKey: ['computeHourPrice'],
    enabled: !!(api && apiState === 'READY'),
    queryFn: () => getComputeHourPrice(api),
  })
}

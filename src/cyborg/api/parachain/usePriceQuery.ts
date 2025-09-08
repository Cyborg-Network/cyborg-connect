import { useQuery } from '@tanstack/react-query'
import { TypedApi } from 'polkadot-api'
import { CyborgParachain } from '@polkadot-api/descriptors'
import { useParachain } from '../../context/PapiContext'

const getComputeHourPrice = async (api: TypedApi<CyborgParachain>): Promise<bigint> => {
  return await api.query.Payment.SubscriptionFee.getValue()
}

export const usePriceQuery = () => {
  const { parachainApi } = useParachain()

  return useQuery({
    queryKey: ['computeHourPrice'],
    enabled: !!(parachainApi),
    queryFn: () => getComputeHourPrice(parachainApi),
  })
}

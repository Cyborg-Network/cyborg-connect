import { useQuery } from '@tanstack/react-query'
import { TypedApi } from 'polkadot-api'
import { CyborgParachain } from '@polkadot-api/descriptors'
import { useParachain } from '../../context/PapiContext'

const getAssetSubscriptionFee = async (
  api: TypedApi<CyborgParachain>, 
  assetId: number
): Promise<bigint> => {
  return await api.query.Payment.AssetSubscriptionFees.getValue(assetId)
}

export const useAssetPriceQuery = (assetId: number) => {
  const { parachainApi } = useParachain()

  return useQuery({
    queryKey: ['assetSubscriptionFee', assetId],
    enabled: !!(parachainApi && assetId > 0),
    queryFn: () => getAssetSubscriptionFee(parachainApi, assetId),
  })
}
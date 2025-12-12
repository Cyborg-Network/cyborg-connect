import { useQuery } from '@tanstack/react-query'
import { TypedApi } from 'polkadot-api'
import { CyborgParachain } from '@polkadot-api/descriptors'
import { useParachain } from '../../context/PapiContext'

const getAssetSubscriptionFee = async (
  api: TypedApi<CyborgParachain>, 
  assetId: number
): Promise<bigint> => {
  if (assetId === 0) {
    // Native token - use the main subscription fee
    return await api.query.Payment.SubscriptionFee.getValue()
  } else {
    // Asset-based fee
    const fee = await api.query.Payment.AssetSubscriptionFees.getValue(assetId)
    return fee || 0n
  }
}

export const useAssetPriceQuery = (assetId: number) => {
  const { parachainApi } = useParachain()

  return useQuery({
    queryKey: ['assetSubscriptionFee', assetId],
    enabled: !!(parachainApi),
    queryFn: () => getAssetSubscriptionFee(parachainApi, assetId),
  })
}
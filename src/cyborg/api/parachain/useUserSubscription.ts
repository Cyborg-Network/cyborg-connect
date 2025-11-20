import { useQuery } from '@tanstack/react-query'
import { TypedApi } from 'polkadot-api'
import { CyborgParachain } from '@polkadot-api/descriptors'
import { InjectedPolkadotAccount } from 'polkadot-api/pjs-signer'
import { useParachain } from '../../context/PapiContext'

// Get native token compute hours
const getUserComputeHours = async (
  api: TypedApi<CyborgParachain>, 
  account: InjectedPolkadotAccount
): Promise<number> => {
  return await api.query.Payment.ComputeHours.getValue(account.address)
}

// Get asset-based compute hours for a specific asset
const getAssetComputeHours = async (
  api: TypedApi<CyborgParachain>, 
  account: InjectedPolkadotAccount,
  assetId: number
): Promise<number> => {
  return await api.query.Payment.AssetComputeHours.getValue(account.address, assetId)
}

// Get total compute hours across all assets
const getTotalComputeHours = async (
  api: TypedApi<CyborgParachain>, 
  account: InjectedPolkadotAccount
): Promise<number> => {
  const nativeHours = await getUserComputeHours(api, account)
  
  // For now, we'll just return native hours
  // We sum across all assets here
  return nativeHours
}

export const useUserComputeHoursQuery = () => {
  const { account, parachainApi } = useParachain()

  return useQuery({
    queryKey: ['userComputeHours'],
    enabled: !!(parachainApi && account),
    queryFn: () => getTotalComputeHours(parachainApi, account),
  })
}

export const useAssetComputeHoursQuery = (assetId: number) => {
  const { account, parachainApi } = useParachain()

  return useQuery({
    queryKey: ['assetComputeHours', assetId],
    enabled: !!(parachainApi && account && assetId > 0),
    queryFn: () => getAssetComputeHours(parachainApi, account, assetId),
  })
}
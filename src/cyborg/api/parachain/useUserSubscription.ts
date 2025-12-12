import { useQuery } from '@tanstack/react-query'
import { TypedApi } from 'polkadot-api'
import { CyborgParachain } from '@polkadot-api/descriptors'
import { InjectedPolkadotAccount } from 'polkadot-api/pjs-signer'
import { useParachain } from '../../context/PapiContext'

// Get unified compute hours (works for all payment methods)
const getUserComputeHours = async (
  api: TypedApi<CyborgParachain>, 
  account: InjectedPolkadotAccount
): Promise<number> => {
  return await api.query.Payment.ComputeHours.getValue(account.address)
}

export const useUserComputeHoursQuery = () => {
  const { account, parachainApi } = useParachain()

  return useQuery({
    queryKey: ['userComputeHours'],
    enabled: !!(parachainApi && account),
    queryFn: () => getUserComputeHours(parachainApi, account),
  })
}

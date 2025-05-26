import { ApiPromise } from '@polkadot/api'

export const getComputeHourPrice = async (api: ApiPromise) => {
  return await api.query.payment.pricePerHour()
}

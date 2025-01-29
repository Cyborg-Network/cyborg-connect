import { useSubstrateState } from '../../../substrate-lib/SubstrateContext'
import { useQuery } from '@tanstack/react-query';

const getComputeHourPrice = async (api) => {
  return await api.query.payment.pricePerHour();
}

export const usePriceQuery = () => {
  const { api, apiState } = useSubstrateState()

  return useQuery({
    queryKey: ["computeHourPrice"],
    enabled: !!(api && apiState === "READY"),
    queryFn: () => getComputeHourPrice(api),
  });
};

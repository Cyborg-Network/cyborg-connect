import { ApiPromise } from '@polkadot/api';
import { useSubstrateState } from '../../../substrate-lib/SubstrateContext'
import { useQuery } from '@tanstack/react-query';
import { transformToNumber } from '../../util/numberOperations';

const getComputeHourPrice = async (api: ApiPromise): Promise<number> => {
  return transformToNumber((await api.query.payment.pricePerHour()).toString());
}

export const usePriceQuery = () => {
  const { api, apiState } = useSubstrateState()

  return useQuery({
    queryKey: ["computeHourPrice"],
    enabled: !!(api && apiState === "READY"),
    queryFn: () => getComputeHourPrice(api),
  });
};

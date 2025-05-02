import { useSubstrateState } from '../../../substrate-lib/SubstrateContext'
import { useQuery } from '@tanstack/react-query';
import { i32CoordinateToFloatCoordinate } from '../../util/coordinateConversion';
import { getAccount } from '../../util/getAccount';
import { ApiPromise } from '@polkadot/api';
import { AccountId32 } from '@polkadot/types/interfaces';

type workerType = "executableWorkers" | "workerClusters";

const getWorkers = async (api: ApiPromise, workerType: workerType) => {
      const workerEntries = await api.query.edgeConnect[workerType].entries()

      const workers = workerEntries.map(([_key, value]) => {
        const data: any = value.toHuman()

        return { 
          ...data, 
          location: {
            latitude: i32CoordinateToFloatCoordinate(data.location.latitude),
            longitude: i32CoordinateToFloatCoordinate(data.location.longitude)
          }, 
          lastTask: null,
          workerType: workerType
        }
      })

      return workers;
}

const getUserWorkers = async (
  api: ApiPromise, 
  currentAccount: AccountId32, 
  isProvider: boolean, 
  workerType: workerType
) => {
  if(isProvider){
    const workers = await getWorkers(api, workerType);
    const userAccount = await getAccount(currentAccount);
    const userAddress = userAccount[0];

    return workers.filter(worker => worker.owner === userAddress)
  }
  //TODO: This whole next block is wildly inefficient, but a more efficient approach 
  // requires a fix on the parachain side
  if(!isProvider){
    const userAccount = await getAccount(currentAccount);
    const userAddress = userAccount[0];

    const workers = await getWorkers(api, workerType);
    const taskEntries = await api.query.taskManagement.taskAllocations.entries();
    const allTaskOwners = await api.query.taskManagement.taskOwners.entries();

    const userWorkers = [];

    const tasks = taskEntries
      .map(([key, value]) => {
        const [taskExecutor, workerId]: any = value.toHuman()
        return {
          taskExecutor,
          workerId,
          taskId: Number(key.toHuman()[0]),
        }
      });

    const workersWithLastTasks = workers
      .map(worker => {
        const reversedIndex = [...tasks].reverse().findIndex(
        ({ taskExecutor, workerId }) => worker.owner === taskExecutor && worker.id === workerId
      );

      const lastTaskIndex = reversedIndex !== -1 ? tasks.length - 1 - reversedIndex : -1;
    
      return lastTaskIndex !== -1 ? { ...worker, lastTask: lastTaskIndex } : null;
    })
    .filter(Boolean);

    const userOwnedTasks = allTaskOwners.reduce((acc, [key, value]) => {
      if(value.toHuman() === userAddress){
        acc.push(parseInt(key.toHuman()[0]));
      }
      return acc;
    }, []);

    if(userOwnedTasks)
    workersWithLastTasks.forEach(worker => {
      if(userOwnedTasks.includes(worker.lastTask)){
        userWorkers.push(worker);
      }
    })

    console.log(userWorkers);

    return userWorkers;
  }
}

// This is not used at the moment, but a version of this will be in the future
export const useWorkersQuery = (workerType: workerType) => {
  const { api, apiState } = useSubstrateState()

  return useQuery({
    queryKey: [workerType],
    queryFn: () => getWorkers(api, workerType),
    enabled: !!(api && apiState === "READY"),
  });
};

export const useUserWorkersQuery = (isProvider: boolean, workerType: workerType) => {
  const { api, apiState, currentAccount } = useSubstrateState()

  return useQuery({
    queryKey: [isProvider, workerType],
    queryFn: () => getUserWorkers(api, currentAccount, isProvider, workerType),
    enabled: !!(api && apiState === "READY" && currentAccount),
  });
};

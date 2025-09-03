import { useSubstrateState } from '../../../substrate-lib/SubstrateContext'
import { useQuery } from '@tanstack/react-query'
import { i32CoordinateToFloatCoordinate } from '../../util/coordinateConversion'
import { Service } from '../../hooks/useService'
import { TypedApi } from 'polkadot-api'
import { CyborgParachain, CyborgParachainQueries } from '@polkadot-api/descriptors'
import { InjectedPolkadotAccount } from 'polkadot-api/dist/reexports/pjs-signer'

type workerType = 'executableWorkers' | 'workerClusters'

export type Miner = 
  CyborgParachainQueries["EdgeConnect"]["ExecutableWorkers"]["Value"] |
  CyborgParachainQueries["EdgeConnect"]["WorkerClusters"]["Value"];


type WorkerCluster = {
  keyArgs: CyborgParachainQueries["EdgeConnect"]["WorkerClusters"]["KeyArgs"]; 
  value: CyborgParachainQueries["EdgeConnect"]["WorkerClusters"]["Value"];
};

type ExecutableWorker = {
  keyArgs: CyborgParachainQueries["EdgeConnect"]["ExecutableWorkers"]["KeyArgs"]; 
  value: CyborgParachainQueries["EdgeConnect"]["ExecutableWorkers"]["Value"];
}


const getWorkers = async (api: TypedApi<CyborgParachain>, workerType: workerType): Promise<Miner[]>  => {
  let workerEntries: WorkerCluster[] | ExecutableWorker[]
  switch (workerType) {
    case "executableWorkers":
      workerEntries = await api.query.EdgeConnect.ExecutableWorkers.getEntries();
      break;
    case "workerClusters":
      workerEntries = await api.query.EdgeConnect.WorkerClusters.getEntries();
      break;
  }

  const workers = workerEntries.map(({value}) => {
    return {
      ...value,
      location: {
        latitude: i32CoordinateToFloatCoordinate(value.location.latitude),
        longitude: i32CoordinateToFloatCoordinate(value.location.longitude),
      },
      lastTask: null,
      workerType: workerType,
    }
  })

  return workers
}

const getUserWorkers = async (
  api: TypedApi<CyborgParachain>,
  account: InjectedPolkadotAccount,
  isProvider: boolean,
  workerType: workerType
): Promise<Miner[]> => {
  const userAddress = account.address

  if (isProvider) {
    const workers = await getWorkers(api, workerType)
    return workers.filter(worker => worker.owner === userAddress)
  }

  //TODO: This whole next block is wildly inefficient, but a more efficient approach
  // requires a fix on the parachain side
  if (!isProvider) {
    const workers = await getWorkers(api, workerType)
    const taskEntries = await api.query.TaskManagement.TaskAllocations.getEntries();
    const allTaskOwners = await api.query.TaskManagement.TaskOwners.getEntries();

    const userWorkers = []

    const tasks = taskEntries.map(({keyArgs, value}) => {
      return {
        taskExecutor: value[0],
        workerId: value[1],
        taskId: keyArgs[0],
      }
    })

    const workersWithLastTasks = workers
      .map(worker => {
        const reversedIndex = [...tasks]
          .reverse()
          .findIndex(
            ({ taskExecutor, workerId }) =>
              worker.owner === taskExecutor && worker.id === workerId
          )

        const lastTaskIndex =
          reversedIndex !== -1 ? tasks.length - 1 - reversedIndex : -1

        return lastTaskIndex !== -1
          ? { ...worker, lastTask: lastTaskIndex }
          : null
      })
      .filter(Boolean)

    const userOwnedTasks = allTaskOwners.reduce((acc, {keyArgs, value}) => {
      if (value === userAddress) {
        acc.push(keyArgs[0])
      }
      return acc
    }, [])

    if (userOwnedTasks) {
      workersWithLastTasks.forEach(worker => {
        if (userOwnedTasks.includes(worker.lastTask)) {
          userWorkers.push(worker)
        }
      })
    }

    console.log(`User Miners: ${userWorkers}`)

    return userWorkers
  }
}

// This is not used at the moment, but a version of this will be in the future
export const useWorkersQuery = (service: Service) => {
  const { api, apiState } = useSubstrateState()

  return useQuery({
    queryKey: [service?.workerType],
    queryFn: () => getWorkers(api, service?.workerType),
    enabled: !!(api && apiState === 'READY' && service),
  })
}

export const useUserWorkersQuery = (
  isProvider: boolean,
  workerType: workerType
) => {
  const { api, apiState, currentAccount } = useSubstrateState()

  return useQuery({
    queryKey: [isProvider, workerType],
    queryFn: () => getUserWorkers(api, currentAccount, isProvider, workerType),
    enabled: !!(api && apiState === 'READY' && currentAccount),
  })
}

import { useQuery } from '@tanstack/react-query'
import { i32CoordinateToFloatCoordinate } from '../../util/coordinateConversion'
import { Service } from '../../hooks/useService'
import { TypedApi } from 'polkadot-api'
import { CyborgParachain, CyborgParachainQueries } from '@polkadot-api/descriptors'
import { InjectedPolkadotAccount } from 'polkadot-api/dist/reexports/pjs-signer'
import { useParachain } from '../../context/PapiContext'

type workerType = 'executableWorkers' | 'workerClusters'

export type Miner = 
  CyborgParachainQueries["EdgeConnect"]["EdgeMiners"]["Value"] |
  CyborgParachainQueries["EdgeConnect"]["CloudMiners"]["Value"];


type WorkerCluster = {
  keyArgs: CyborgParachainQueries["EdgeConnect"]["CloudMiners"]["KeyArgs"]; 
  value: CyborgParachainQueries["EdgeConnect"]["CloudMiners"]["Value"];
};

type ExecutableWorker = {
  keyArgs: CyborgParachainQueries["EdgeConnect"]["EdgeMiners"]["KeyArgs"]; 
  value: CyborgParachainQueries["EdgeConnect"]["EdgeMiners"]["Value"];
}

export type UserMiner = Miner & { lastTask: bigint };


const getWorkers = async (api: TypedApi<CyborgParachain>, workerType: workerType): Promise<Miner[]>  => {
  let workerEntries: WorkerCluster[] | ExecutableWorker[]
  switch (workerType) {
    case "executableWorkers":
      workerEntries = await api.query.EdgeConnect.EdgeMiners.getEntries();
      break;
    case "workerClusters":
      workerEntries = await api.query.EdgeConnect.CloudMiners.getEntries();
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

const getProviderWorkers = async(
  api: TypedApi<CyborgParachain>,
  account: InjectedPolkadotAccount,
  workerType: workerType
): Promise<Miner[]> => {
  const userAddress = account.address
  const workers = await getWorkers(api, workerType)
  return workers.filter(worker => worker.owner === userAddress)
}

const getUserWorkers = async (
  api: TypedApi<CyborgParachain>,
  account: InjectedPolkadotAccount,
  workerType: workerType
): Promise<UserMiner[]> => {
  const userAddress = account.address
  //TODO: This whole next block is wildly inefficient, but a straightforward approach
  // requires the attestation and location mapping fix on the parachain side
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
        ? { ...worker, lastTask: BigInt(lastTaskIndex) }
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

  return userWorkers
}

// This is not used at the moment, but a version of this will be in the future
export const useWorkersQuery = (service: Service) => {
  const {parachainApi} = useParachain()

  return useQuery({
    queryKey: [service?.workerType],
    queryFn: (): Promise<Miner[]> => getWorkers(parachainApi, service?.workerType),
    enabled: !!(parachainApi && service),
  })
}

export const useUserWorkersQuery = (
  workerType: workerType
) => {
  const {parachainApi, account} = useParachain()

  return useQuery({
    queryKey: ['user', workerType],
    queryFn: (): Promise<UserMiner[]> => getUserWorkers(parachainApi, account, workerType),
    enabled: !!(parachainApi && account),
  })
}

export const useProviderWorkersQuery = (
  workerType: workerType
) => {
  const {parachainApi, account} = useParachain()

  return useQuery({
    queryKey: [workerType],
    queryFn: (): Promise<Miner[]> => getProviderWorkers(parachainApi, account, workerType),
    enabled: !!(parachainApi && account),
  })
}

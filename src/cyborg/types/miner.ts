import { Miner } from '../api/parachain/useWorkersQuery'
import { Location } from './location'

export interface MinerReactRouterStateWithLocation {
  userLocation: Location,
  selectedNodeId: MinerReactRouterState
}

export interface MinerReactRouterState {
  id: Miner["id"], 
  owner: Miner["owner"]
}

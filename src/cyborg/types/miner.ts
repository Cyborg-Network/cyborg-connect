import { Miner } from '../api/parachain/useWorkersQuery'
import { Location } from './location'

export interface MinerReactRouterStateWithLocation {
  userLocation: Location,
  selectedNodeId: Miner["id"]
}

export interface MinerReactRouterState {
  id: Miner["id"], 
  owner: Miner["owner"]
}

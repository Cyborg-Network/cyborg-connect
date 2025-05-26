import { Location } from './location'

interface MinerSpecs {
  ram: number
  storage: number
  cores: number
}

type MinerStatus = 'busy' | 'active' | 'inactive'

interface WorkerApi {
  domain: String
}

export interface Miner {
  id: String
  owner: String
  location: Location
  specs: MinerSpecs
  reputation: number
  start_block: number
  status: MinerStatus
  status_last_updated: number
  api: WorkerApi
  last_status_check: number
}

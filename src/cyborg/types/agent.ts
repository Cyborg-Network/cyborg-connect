export interface MinerSpecs {
  specs: {
    os: string
    memory: number
    disk: number
    cpus: string[]
  },
  location: { coordinates: number[] }
}

export interface MinerUsageData {
  CPU: number[]
  RAM: number[]
  DISK: number[]
  timestamp: string[]
  zkStage: number
}

export interface LockState {
  isLocked: boolean
  isLoading: boolean
}

export type AgentRequestType = 'Auth' | 'Usage' | 'Init'

export type Logs = string[]

export type IpAddress = string

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

export interface ContainerKeypair {
  pub_key: string
  priv_key: string
}

type AgentEndpointSimple = "Auth" | "Usage" | "Init"

type AgentEndpointCreateContainerKeypairRequest = {
  CreateContainerKey: {
    task_id: string;
  };
}

export type AgentEndpointDepositContainerKeyRequest = {
  DepositContainerKey: {
    task_id: string;
    key: string;
  };
};

export type AgentRequestType = 
  | AgentEndpointSimple 
  | AgentEndpointCreateContainerKeypairRequest
  | AgentEndpointDepositContainerKeyRequest;

export type Logs = string[]

export type IpAddress = string

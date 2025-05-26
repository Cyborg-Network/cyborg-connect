import { Data } from '../components/general/Chart'

export type MetricName = 'RAM' | 'CPU' | 'DISK'

export interface SelectedGaugeState {
  name: MetricName
  color: string
  data: Data
}

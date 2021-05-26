import { useContext } from 'react'
import { DashboardContext } from '../contexts/StakingData'

export default function useDashboardData(getCustomData) {
  const dashboardData = useContext(DashboardContext)

  return typeof getCustomData === 'function' ? getCustomData(dashboardData) : dashboardData
}

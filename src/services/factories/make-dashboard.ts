import { PrismaDashboardRepository } from '../../repositories/prisma/prisma-dashboard-repository'
import { GetDashboardMetricsUseCase } from '../dashboard/get-dashboard-metrics-use-case'

export function makeGetDashboardMetrics() {
  const repository = new PrismaDashboardRepository()
  return new GetDashboardMetricsUseCase(repository)
}

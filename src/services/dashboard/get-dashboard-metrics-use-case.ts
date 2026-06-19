import {
  IDashboardRepository,
  DashboardMetrics,
} from '../../repositories/interfaces/IDashboardRepository'
import { subDays } from 'date-fns'

interface GetDashboardMetricsRequest {
  days?: number // default 7
}

interface GetDashboardMetricsResponse {
  metrics: DashboardMetrics
}

export class GetDashboardMetricsUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute({
    days = 7,
  }: GetDashboardMetricsRequest): Promise<GetDashboardMetricsResponse> {
    const endDate = new Date()
    const startDate = subDays(endDate, days)

    const metrics = await this.dashboardRepository.getMetrics(
      startDate,
      endDate,
    )

    return { metrics }
  }
}

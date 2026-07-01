import {
  IDashboardRepository,
  DashboardMetrics,
} from '../../repositories/interfaces/IDashboardRepository'
import { subDays, startOfDay, endOfDay } from 'date-fns'

interface GetDashboardMetricsRequest {
  days?: number // default 7
  startDate?: string
  endDate?: string
}

interface GetDashboardMetricsResponse {
  metrics: DashboardMetrics
}

export class GetDashboardMetricsUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute({
    days = 7,
    startDate: customStart,
    endDate: customEnd,
  }: GetDashboardMetricsRequest): Promise<GetDashboardMetricsResponse> {
    let startDate: Date
    let endDate: Date

    if (customStart && customEnd) {
      // Modo Personalizado (força timezone local adicionando a hora)
      startDate = startOfDay(new Date(`${customStart}T00:00:00`))
      endDate = endOfDay(new Date(`${customEnd}T00:00:00`))
    } else if (days === 0) {
      // Modo Hoje
      startDate = startOfDay(new Date())
      endDate = new Date()
    } else {
      // Modo N dias predefinido
      endDate = new Date()
      startDate = subDays(endDate, days)
    }

    const metrics = await this.dashboardRepository.getMetrics(
      startDate,
      endDate,
    )

    return { metrics }
  }
}

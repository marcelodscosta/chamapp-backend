import { describe, it, expect, beforeEach } from 'vitest'
import { GetDashboardMetricsUseCase } from './get-dashboard-metrics-use-case'
import { InMemoryDashboardRepository } from '../../repositories/in-memory/in-memory-dashboard-repository'

let dashboardRepository: InMemoryDashboardRepository
let sut: GetDashboardMetricsUseCase

describe('GetDashboardMetricsUseCase', () => {
  beforeEach(() => {
    dashboardRepository = new InMemoryDashboardRepository()
    sut = new GetDashboardMetricsUseCase(dashboardRepository)
  })

  it('deve retornar as métricas do dashboard agrupadas', async () => {
    const { metrics } = await sut.execute({ days: 7 })

    expect(metrics.totalRevenue).toBe(1500)
    expect(metrics.totalOrders).toBe(10)
    expect(metrics.newCustomers).toBe(5)
    expect(metrics.ordersByStatus.DELIVERED).toBe(8)
    expect(metrics.revenueByDay).toHaveLength(1)
  })
})

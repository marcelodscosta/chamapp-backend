import {
  IDashboardRepository,
  DashboardMetrics,
  RevenueByDay,
} from '../interfaces/IDashboardRepository'

export class InMemoryDashboardRepository implements IDashboardRepository {
  public mockMetrics: DashboardMetrics = {
    totalRevenue: 1500,
    totalOrders: 10,
    ordersByStatus: { PENDING: 2, DELIVERED: 8 },
    revenueByDay: [{ date: '2026-06-19', revenue: 1500 }],
    newCustomers: 5,
  }

  async getMetrics(startDate: Date, endDate: Date): Promise<DashboardMetrics> {
    return this.mockMetrics
  }
}

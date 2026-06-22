import {
  IDashboardRepository,
  DashboardMetrics,
  RevenueByDay,
} from '../interfaces/IDashboardRepository'

export class InMemoryDashboardRepository implements IDashboardRepository {
  public mockMetrics: DashboardMetrics = {
    totalRevenue: 0,
    totalOrders: 0,
    ordersByStatus: { PENDING: 0, DELIVERED: 0 },
    revenueByDay: [],
    salesByPaymentMethod: [],
    productSales: [],
    newCustomers: 0,
  }

  async getMetrics(startDate: Date, endDate: Date): Promise<DashboardMetrics> {
    return this.mockMetrics
  }
}

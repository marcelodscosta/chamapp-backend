import { OrderStatus } from '../../generated/prisma'

export interface RevenueByDay {
  date: string
  revenue: number
}

export interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  ordersByStatus: Record<string, number>
  revenueByDay: RevenueByDay[]
  newCustomers: number
}

export interface IDashboardRepository {
  getMetrics(startDate: Date, endDate: Date): Promise<DashboardMetrics>
}

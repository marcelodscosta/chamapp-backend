import { OrderStatus } from '../../generated/prisma'

export interface RevenueByDay {
  date: string
  revenue: number
}

export interface SalesByPaymentMethod {
  method: string
  total: number
  count: number
}

export interface ProductSales {
  productId: string
  name: string
  quantitySold: number
  totalRevenue: number
  averageTicket: number
}

export interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  averageTicket?: number
  ordersByStatus: Record<string, number>
  revenueByDay: RevenueByDay[]
  salesByPaymentMethod: SalesByPaymentMethod[]
  productSales: ProductSales[]
  newCustomers: number
}

export interface IDashboardRepository {
  getMetrics(startDate: Date, endDate: Date): Promise<DashboardMetrics>
}

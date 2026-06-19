import { prisma } from '../../lib/prisma'
import {
  IDashboardRepository,
  DashboardMetrics,
  RevenueByDay,
} from '../interfaces/IDashboardRepository'
import { OrderStatus, Role } from '../../generated/prisma'
import { format } from 'date-fns'

export class PrismaDashboardRepository implements IDashboardRepository {
  async getMetrics(startDate: Date, endDate: Date): Promise<DashboardMetrics> {
    const revenueAggr = await prisma.order.aggregate({
      where: {
        created_at: { gte: startDate, lte: endDate },
        status: {
          in: [
            OrderStatus.DELIVERED,
            OrderStatus.CONFIRMED,
            OrderStatus.OUT_FOR_DELIVERY,
          ],
        },
      },
      _sum: { total_value: true },
      _count: { id: true },
    })

    const statusGroup = await prisma.order.groupBy({
      by: ['status'],
      where: { created_at: { gte: startDate, lte: endDate } },
      _count: { id: true },
    })

    const ordersByStatus: Record<string, number> = {}
    for (const group of statusGroup) {
      ordersByStatus[group.status] = group._count.id
    }

    // Revenue by day - via raw query since prisma groupBy by day isn't straightforward without raw
    // For SQLite or Postgres, we usually group by DATE(created_at).
    // Aqui usaremos o aggregate mas para o MVP vamos trazer as ordens do periodo e reduzir na memoria
    // (O período ideal de dashboard costuma ser 7, 15, ou 30 dias. Reduzir 30 dias na memória é inofensivo para MVP)
    const ordersInPeriod = await prisma.order.findMany({
      where: {
        created_at: { gte: startDate, lte: endDate },
        status: {
          in: [
            OrderStatus.DELIVERED,
            OrderStatus.CONFIRMED,
            OrderStatus.OUT_FOR_DELIVERY,
          ],
        },
      },
      select: { created_at: true, total_value: true },
    })

    const revenueMap: Record<string, number> = {}
    for (const order of ordersInPeriod) {
      const day = format(order.created_at, 'yyyy-MM-dd')
      if (!revenueMap[day]) revenueMap[day] = 0
      revenueMap[day] += Number(order.total_value)
    }

    const revenueByDay: RevenueByDay[] = Object.entries(revenueMap).map(
      ([date, revenue]) => ({
        date,
        revenue,
      }),
    )
    // Ordenar cronologicamente
    revenueByDay.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    // Novos clientes cadastrados no periodo
    const newCustomersCount = await prisma.user.count({
      where: {
        role: Role.CUSTOMER,
        created_at: { gte: startDate, lte: endDate },
      },
    })

    return {
      totalRevenue: Number(revenueAggr._sum.total_value) || 0,
      totalOrders: revenueAggr._count.id || 0,
      ordersByStatus,
      revenueByDay,
      newCustomers: newCustomersCount,
    }
  }
}

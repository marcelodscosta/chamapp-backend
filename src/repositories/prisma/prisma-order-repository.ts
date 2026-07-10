import { prisma } from '../../lib/prisma'
import {
  IOrderRepository,
  CreateOrderData,
  ListOrdersParams,
  OrderWithItems,
} from '../interfaces/IOrderRepository'
import { Order, OrderStatus, Prisma } from '../../generated/prisma'

export class PrismaOrderRepository implements IOrderRepository {
  async findById(id: string): Promise<OrderWithItems | null> {
    return prisma.order.findUnique({
      where: { id },
      include: { items: true, customer: true, address: true },
    })
  }

  async list(
    params: ListOrdersParams,
  ): Promise<{ orders: OrderWithItems[]; total: number }> {
    const where: Prisma.OrderWhereInput = {}

    if (params.customerId) where.customerId = params.customerId
    if (params.deliveryPersonId)
      where.deliveryPersonId = params.deliveryPersonId
    if (params.status) where.status = params.status

    const page = params.page || 1
    const limit = params.limit || 10
    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { items: true, customer: true, address: true },
      }),
      prisma.order.count({ where }),
    ])

    return { orders, total }
  }

  async create(data: CreateOrderData): Promise<Order> {
    const orderNumber = await this.getNextOrderNumber()

    return prisma.order.create({
      data: {
        order_number: orderNumber,
        customerId: data.customerId,
        addressId: data.addressId,
        payment_method: data.payment_method,
        change_for: data.change_for,
        has_empty_cylinder: data.has_empty_cylinder,
        subtotal: data.subtotal,
        delivery_fee: data.delivery_fee,
        total_value: data.total_value,
        notes: data.notes,
        points_redeemed: data.points_redeemed,
        points_discount: data.points_discount,
        is_scheduled: data.is_scheduled,
        scheduled_date: data.scheduled_date,
        scheduled_time_slot: data.scheduled_time_slot,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal,
            notes: item.notes,
          })),
        },
      },
    })
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    extra?: Partial<Order>,
  ): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data: {
        status,
        ...extra,
      },
    })
  }

  async getNextOrderNumber(): Promise<string> {
    // Busca o último pedido do dia atual
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const lastOrder = await prisma.order.findFirst({
      where: {
        created_at: {
          gte: today,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    const prefix = `${today.getFullYear()}${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`

    if (!lastOrder) {
      return `${prefix}-0001`
    }

    const lastNumber = parseInt(lastOrder.order_number.split('-')[1], 10)
    const nextNumber = (lastNumber + 1).toString().padStart(4, '0')

    return `${prefix}-${nextNumber}`
  }

  async hasActiveOrder(customerId: string): Promise<boolean> {
    const count = await prisma.order.count({
      where: {
        customerId,
        status: {
          in: [
            OrderStatus.PENDING,
            OrderStatus.CONFIRMED,
            OrderStatus.PREPARING,
            OrderStatus.OUT_FOR_DELIVERY,
          ],
        },
      },
    })
    return count > 0
  }
}

import {
  IOrderRepository,
  CreateOrderData,
  ListOrdersParams,
  OrderWithItems,
} from '../interfaces/IOrderRepository'
import { Order, OrderStatus } from '../../generated/prisma'
import { Decimal } from '../../generated/prisma/runtime/library'
import { randomUUID } from 'node:crypto'

export class InMemoryOrderRepository implements IOrderRepository {
  public items: OrderWithItems[] = []

  async findById(id: string): Promise<OrderWithItems | null> {
    return this.items.find((o) => o.id === id) ?? null
  }

  async list(
    params: ListOrdersParams,
  ): Promise<{ orders: OrderWithItems[]; total: number }> {
    let filtered = this.items

    if (params.customerId) {
      filtered = filtered.filter((o) => o.customerId === params.customerId)
    }

    if (params.deliveryPersonId) {
      filtered = filtered.filter(
        (o) => o.deliveryPersonId === params.deliveryPersonId,
      )
    }

    if (params.status) {
      filtered = filtered.filter((o) => o.status === params.status)
    }

    filtered.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())

    const page = params.page || 1
    const limit = params.limit || 10
    const start = (page - 1) * limit
    const end = start + limit

    return {
      orders: filtered.slice(start, end),
      total: filtered.length,
    }
  }

  async create(data: CreateOrderData): Promise<Order> {
    const orderNumber = await this.getNextOrderNumber()

    const newOrder: OrderWithItems = {
      id: randomUUID(),
      order_number: orderNumber,
      customerId: data.customerId,
      addressId: data.addressId,
      deliveryPersonId: null,
      status: 'PENDING',
      payment_method: data.payment_method,
      change_for: data.change_for ? new Decimal(data.change_for) : null,
      has_empty_cylinder: data.has_empty_cylinder ?? false,
      subtotal: new Decimal(data.subtotal),
      delivery_fee: new Decimal(data.delivery_fee),
      total_value: new Decimal(data.total_value),
      estimated_minutes: null,
      notes: data.notes ?? null,
      cancellation_reason: null,
      payment_confirmed: false,
      delivery_proof_url: null,
      is_scheduled: data.is_scheduled ?? false,
      scheduled_date: data.scheduled_date ? new Date(data.scheduled_date) : null,
      scheduled_time_slot: data.scheduled_time_slot ?? null,
      points_redeemed: data.points_redeemed ?? 0,
      points_discount: new Decimal(data.points_discount ?? 0),
      points_earned: 0,
      cashback_earned: new Decimal(0),
      created_at: new Date(),
      updated_at: new Date(),
      confirmed_at: null,
      dispatched_at: null,
      delivered_at: null,
      cancelled_at: null,
      items: data.items.map((i) => ({
        id: randomUUID(),
        orderId: 'temp',
        productId: i.productId,
        name: i.name,
        price: new Decimal(i.price),
        quantity: i.quantity,
        subtotal: new Decimal(i.subtotal),
        notes: i.notes ?? null,
      })),
    }

    newOrder.items.forEach((item) => {
      item.orderId = newOrder.id
    })

    this.items.push(newOrder)
    return newOrder
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    extra?: Partial<Order>,
  ): Promise<Order> {
    const index = this.items.findIndex((o) => o.id === id)
    if (index === -1) throw new Error(`Order ${id} not found`)

    const updated = {
      ...this.items[index],
      status,
      ...extra,
      updated_at: new Date(),
    } as OrderWithItems

    this.items[index] = updated
    return updated
  }

  async getNextOrderNumber(): Promise<string> {
    const today = new Date()
    const prefix = `${today.getFullYear()}${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`

    const todayOrders = this.items.filter((o) =>
      o.order_number.startsWith(prefix),
    )

    if (todayOrders.length === 0) {
      return `${prefix}-0001`
    }

    todayOrders.sort((a, b) => b.order_number.localeCompare(a.order_number))
    const lastNumber = parseInt(todayOrders[0].order_number.split('-')[1], 10)
    const nextNumber = (lastNumber + 1).toString().padStart(4, '0')

    return `${prefix}-${nextNumber}`
  }
}

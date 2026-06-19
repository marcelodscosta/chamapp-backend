import {
  Order,
  OrderStatus,
  PaymentMethod,
  OrderItem,
} from '../../generated/prisma'
import { Decimal } from '../../generated/prisma/runtime/library'

export interface CreateOrderItemData {
  productId: string
  name: string
  price: Decimal | number
  quantity: number
  subtotal: Decimal | number
  notes?: string
}

export interface CreateOrderData {
  customerId: string
  addressId: string
  payment_method: PaymentMethod
  change_for?: Decimal | number
  has_empty_cylinder?: boolean
  subtotal: Decimal | number
  delivery_fee: Decimal | number
  total_value: Decimal | number
  notes?: string
  points_redeemed?: number
  points_discount?: Decimal | number
  items: CreateOrderItemData[]
}

export interface ListOrdersParams {
  customerId?: string
  deliveryPersonId?: string
  status?: OrderStatus
  page?: number
  limit?: number
}

export type OrderWithItems = Order & { items: OrderItem[] }

export interface IOrderRepository {
  findById(id: string): Promise<OrderWithItems | null>
  list(
    params: ListOrdersParams,
  ): Promise<{ orders: OrderWithItems[]; total: number }>
  create(data: CreateOrderData): Promise<Order>
  updateStatus(
    id: string,
    status: OrderStatus,
    extra?: Partial<Order>,
  ): Promise<Order>
  getNextOrderNumber(): Promise<string>
}

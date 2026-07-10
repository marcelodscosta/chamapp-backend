import {
  Order,
  OrderStatus,
  PaymentMethod,
  OrderItem,
  User,
  Address,
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
  is_scheduled?: boolean
  scheduled_date?: Date
  scheduled_time_slot?: string
  items: CreateOrderItemData[]
}

export interface ListOrdersParams {
  customerId?: string
  deliveryPersonId?: string
  status?: OrderStatus
  page?: number
  limit?: number
}

export type OrderWithItems = Order & { 
  items: OrderItem[]
  customer?: User
  address?: Address
}

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
  hasActiveOrder(customerId: string): Promise<boolean>
}

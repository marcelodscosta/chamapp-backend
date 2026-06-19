import {
  OrderWithItems,
  IOrderRepository,
} from '../../repositories/interfaces/IOrderRepository'
import { OrderStatus } from '../../generated/prisma'

interface ListOrdersRequest {
  customerId?: string
  deliveryPersonId?: string
  status?: OrderStatus
  page?: number
  limit?: number
}

interface ListOrdersResponse {
  orders: OrderWithItems[]
  total: number
}

export class ListOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute({
    customerId,
    deliveryPersonId,
    status,
    page,
    limit,
  }: ListOrdersRequest): Promise<ListOrdersResponse> {
    const result = await this.orderRepository.list({
      customerId,
      deliveryPersonId,
      status,
      page,
      limit,
    })

    return result
  }
}

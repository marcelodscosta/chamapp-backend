import { PrismaOrderRepository } from '../../repositories/prisma/prisma-order-repository'
import { ListOrdersUseCase } from '../order/list-orders-use-case'

export function makeListOrders() {
  const repository = new PrismaOrderRepository()
  return new ListOrdersUseCase(repository)
}

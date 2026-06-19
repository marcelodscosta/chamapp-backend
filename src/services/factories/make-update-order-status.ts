import { PrismaOrderRepository } from '../../repositories/prisma/prisma-order-repository'
import { UpdateOrderStatusUseCase } from '../order/update-order-status-use-case'

export function makeUpdateOrderStatus() {
  const repository = new PrismaOrderRepository()
  return new UpdateOrderStatusUseCase(repository)
}

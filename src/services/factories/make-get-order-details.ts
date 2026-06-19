import { PrismaOrderRepository } from '../../repositories/prisma/prisma-order-repository'
import { GetOrderDetailsUseCase } from '../order/get-order-details-use-case'

export function makeGetOrderDetails() {
  const repository = new PrismaOrderRepository()
  return new GetOrderDetailsUseCase(repository)
}

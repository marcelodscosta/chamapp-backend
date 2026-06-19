import { PrismaOrderRepository } from '../../repositories/prisma/prisma-order-repository'
import { PrismaProductRepository } from '../../repositories/prisma/prisma-product-repository'
import { PrismaAddressRepository } from '../../repositories/prisma/prisma-address-repository'
import { CreateOrderUseCase } from '../order/create-order-use-case'

export function makeCreateOrder() {
  const orderRepository = new PrismaOrderRepository()
  const productRepository = new PrismaProductRepository()
  const addressRepository = new PrismaAddressRepository()

  return new CreateOrderUseCase(
    orderRepository,
    productRepository,
    addressRepository,
  )
}

import { PrismaProductRepository } from '../../repositories/prisma/prisma-product-repository'
import { ListProductsUseCase } from '../catalog/list-products-use-case'

export function makeListProducts() {
  const repository = new PrismaProductRepository()
  return new ListProductsUseCase(repository)
}

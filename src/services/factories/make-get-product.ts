import { PrismaProductRepository } from '../../repositories/prisma/prisma-product-repository'
import { GetProductUseCase } from '../catalog/get-product-use-case'

export function makeGetProduct() {
  const repository = new PrismaProductRepository()
  return new GetProductUseCase(repository)
}

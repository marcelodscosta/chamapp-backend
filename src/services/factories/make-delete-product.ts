import { PrismaProductRepository } from '../../repositories/prisma/prisma-product-repository'
import { DeleteProductUseCase } from '../catalog/delete-product-use-case'

export function makeDeleteProduct() {
  const productRepository = new PrismaProductRepository()
  const useCase = new DeleteProductUseCase(productRepository)

  return useCase
}

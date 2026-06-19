import { PrismaProductRepository } from '../../repositories/prisma/prisma-product-repository'
import { PrismaCategoryRepository } from '../../repositories/prisma/prisma-category-repository'
import { CreateProductUseCase } from '../catalog/create-product-use-case'

export function makeCreateProduct() {
  const productRepository = new PrismaProductRepository()
  const categoryRepository = new PrismaCategoryRepository()
  return new CreateProductUseCase(productRepository, categoryRepository)
}

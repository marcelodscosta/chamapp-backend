import { PrismaProductRepository } from '../../repositories/prisma/prisma-product-repository'
import { PrismaCategoryRepository } from '../../repositories/prisma/prisma-category-repository'
import { UpdateProductUseCase } from '../catalog/update-product-use-case'

export function makeUpdateProduct() {
  const productRepository = new PrismaProductRepository()
  const categoryRepository = new PrismaCategoryRepository()
  return new UpdateProductUseCase(productRepository, categoryRepository)
}

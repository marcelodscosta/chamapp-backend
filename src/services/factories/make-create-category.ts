import { PrismaCategoryRepository } from '../../repositories/prisma/prisma-category-repository'
import { CreateCategoryUseCase } from '../catalog/create-category-use-case'

export function makeCreateCategory() {
  const repository = new PrismaCategoryRepository()
  return new CreateCategoryUseCase(repository)
}

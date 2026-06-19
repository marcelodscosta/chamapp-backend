import { PrismaCategoryRepository } from '../../repositories/prisma/prisma-category-repository'
import { UpdateCategoryUseCase } from '../catalog/update-category-use-case'

export function makeUpdateCategory() {
  const repository = new PrismaCategoryRepository()
  return new UpdateCategoryUseCase(repository)
}

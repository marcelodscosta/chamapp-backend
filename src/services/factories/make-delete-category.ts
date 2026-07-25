import { PrismaCategoryRepository } from '../../repositories/prisma/prisma-category-repository'
import { DeleteCategoryUseCase } from '../catalog/delete-category-use-case'

export function makeDeleteCategory() {
  const categoryRepository = new PrismaCategoryRepository()
  const useCase = new DeleteCategoryUseCase(categoryRepository)

  return useCase
}

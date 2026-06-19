import { PrismaCategoryRepository } from '../../repositories/prisma/prisma-category-repository'
import { ListCategoriesUseCase } from '../catalog/list-categories-use-case'

export function makeListCategories() {
  const repository = new PrismaCategoryRepository()
  return new ListCategoriesUseCase(repository)
}

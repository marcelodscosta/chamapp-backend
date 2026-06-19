import { ProductCategory } from '../../generated/prisma'
import { ICategoryRepository } from '../../repositories/interfaces/ICategoryRepository'

interface ListCategoriesResponse {
  categories: ProductCategory[]
}

export class ListCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(): Promise<ListCategoriesResponse> {
    const categories = await this.categoryRepository.listAll()

    return { categories }
  }
}

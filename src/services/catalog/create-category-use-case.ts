import { ProductCategory } from '../../generated/prisma'
import { ICategoryRepository } from '../../repositories/interfaces/ICategoryRepository'

interface CreateCategoryRequest {
  name: string
  order?: number
}

interface CreateCategoryResponse {
  category: ProductCategory
}

export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute({
    name,
    order,
  }: CreateCategoryRequest): Promise<CreateCategoryResponse> {
    const category = await this.categoryRepository.create({
      name,
      order,
    })

    return { category }
  }
}

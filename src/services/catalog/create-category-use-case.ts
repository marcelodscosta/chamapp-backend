import { ProductCategory } from '../../generated/prisma'
import { ICategoryRepository } from '../../repositories/interfaces/ICategoryRepository'

interface CreateCategoryRequest {
  name: string
  order?: number
  imageUrl?: string
}

interface CreateCategoryResponse {
  category: ProductCategory
}

export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute({
    name,
    order,
    imageUrl,
  }: CreateCategoryRequest): Promise<CreateCategoryResponse> {
    const category = await this.categoryRepository.create({
      name,
      order,
      image_url: imageUrl,
    })

    return { category }
  }
}

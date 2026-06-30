import { ProductCategory } from '../../generated/prisma'
import { ICategoryRepository } from '../../repositories/interfaces/ICategoryRepository'
import { AppError } from '../errors/app-error'

interface UpdateCategoryRequest {
  categoryId: string
  name?: string
  order?: number
  isActive?: boolean
  imageUrl?: string
}

interface UpdateCategoryResponse {
  category: ProductCategory
}

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute({
    categoryId,
    name,
    order,
    isActive,
    imageUrl,
  }: UpdateCategoryRequest): Promise<UpdateCategoryResponse> {
    const categoryExists = await this.categoryRepository.findById(categoryId)

    if (!categoryExists) {
      throw new AppError('Categoria não encontrada.', 404)
    }

    const category = await this.categoryRepository.update(categoryId, {
      name,
      order,
      is_active: isActive,
      image_url: imageUrl,
    })

    return { category }
  }
}

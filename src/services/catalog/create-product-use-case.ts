import { Product } from '../../generated/prisma'
import { IProductRepository } from '../../repositories/interfaces/IProductRepository'
import { ICategoryRepository } from '../../repositories/interfaces/ICategoryRepository'
import { AppError } from '../errors/app-error'

interface CreateProductRequest {
  categoryId?: string
  name: string
  description?: string
  price: number
  imageUrl?: string
  requiresEmptyReturn?: boolean
  isAvailable?: boolean
  earnsPoints?: boolean
  pointsOverride?: number
  pointsMultiplier?: number
}

interface CreateProductResponse {
  product: Product
}

export class CreateProductUseCase {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository,
  ) {}

  async execute({
    categoryId,
    name,
    description,
    price,
    imageUrl,
    requiresEmptyReturn,
    isAvailable,
    earnsPoints,
    pointsOverride,
    pointsMultiplier,
  }: CreateProductRequest): Promise<CreateProductResponse> {
    if (categoryId) {
      const categoryExists = await this.categoryRepository.findById(categoryId)
      if (!categoryExists) {
        throw new AppError('Categoria não encontrada.', 404)
      }
    }

    const product = await this.productRepository.create({
      categoryId,
      name,
      description,
      price,
      image_url: imageUrl,
      requires_empty_return: requiresEmptyReturn,
      is_available: isAvailable,
      earns_points: earnsPoints,
      points_override: pointsOverride,
      points_multiplier: pointsMultiplier,
    })

    return { product }
  }
}

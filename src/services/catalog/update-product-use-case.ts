import { Product } from '../../generated/prisma'
import { IProductRepository } from '../../repositories/interfaces/IProductRepository'
import { ICategoryRepository } from '../../repositories/interfaces/ICategoryRepository'
import { AppError } from '../errors/app-error'

interface UpdateProductRequest {
  productId: string
  categoryId?: string
  name?: string
  description?: string
  price?: number
  imageUrl?: string
  requiresEmptyReturn?: boolean
  isAvailable?: boolean
  isActive?: boolean
  earnsPoints?: boolean
  pointsOverride?: number
  pointsMultiplier?: number
}

interface UpdateProductResponse {
  product: Product
}

export class UpdateProductUseCase {
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository,
  ) {}

  async execute({
    productId,
    categoryId,
    name,
    description,
    price,
    imageUrl,
    requiresEmptyReturn,
    isAvailable,
    isActive,
    earnsPoints,
    pointsOverride,
    pointsMultiplier,
  }: UpdateProductRequest): Promise<UpdateProductResponse> {
    const productExists = await this.productRepository.findById(productId)

    if (!productExists) {
      throw new AppError('Produto não encontrado.', 404)
    }

    if (categoryId) {
      const categoryExists = await this.categoryRepository.findById(categoryId)
      if (!categoryExists) {
        throw new AppError('Categoria não encontrada.', 404)
      }
    }

    const product = await this.productRepository.update(productId, {
      categoryId,
      name,
      description,
      price,
      image_url: imageUrl,
      requires_empty_return: requiresEmptyReturn,
      is_available: isAvailable,
      is_active: isActive,
      earns_points: earnsPoints,
      points_override: pointsOverride,
      points_multiplier: pointsMultiplier,
    })

    return { product }
  }
}

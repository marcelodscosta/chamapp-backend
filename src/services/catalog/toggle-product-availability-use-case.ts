import { Product } from '../../generated/prisma'
import { IProductRepository } from '../../repositories/interfaces/IProductRepository'
import { AppError } from '../errors/app-error'

interface ToggleProductAvailabilityRequest {
  productId: string
}

interface ToggleProductAvailabilityResponse {
  product: Product
}

export class ToggleProductAvailabilityUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({
    productId,
  }: ToggleProductAvailabilityRequest): Promise<ToggleProductAvailabilityResponse> {
    const productExists = await this.productRepository.findById(productId)

    if (!productExists) {
      throw new AppError('Produto não encontrado.', 404)
    }

    const product = await this.productRepository.updateAvailability(
      productId,
      !productExists.is_available,
    )

    return { product }
  }
}

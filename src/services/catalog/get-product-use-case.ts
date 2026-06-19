import { Product } from '../../generated/prisma'
import { IProductRepository } from '../../repositories/interfaces/IProductRepository'
import { AppError } from '../errors/app-error'

interface GetProductRequest {
  productId: string
}

interface GetProductResponse {
  product: Product
}

export class GetProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({ productId }: GetProductRequest): Promise<GetProductResponse> {
    const product = await this.productRepository.findById(productId)

    if (!product) {
      throw new AppError('Produto não encontrado.', 404)
    }

    return { product }
  }
}

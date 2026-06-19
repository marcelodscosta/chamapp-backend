import { Product } from '../../generated/prisma'
import { IProductRepository } from '../../repositories/interfaces/IProductRepository'

interface ListProductsRequest {
  categoryId?: string
  onlyAvailable?: boolean
  page?: number
  limit?: number
}

interface ListProductsResponse {
  products: Product[]
  total: number
}

export class ListProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({
    categoryId,
    onlyAvailable,
    page,
    limit,
  }: ListProductsRequest): Promise<ListProductsResponse> {
    const { products, total } = await this.productRepository.list({
      categoryId,
      onlyAvailable,
      page,
      limit,
    })

    return { products, total }
  }
}

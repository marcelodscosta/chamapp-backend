import { IProductRepository } from '../../repositories/interfaces/IProductRepository'
import { AppError } from '../errors/app-error'
import { Prisma } from '@prisma/client'

interface DeleteProductRequest {
  productId: string
}

export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({ productId }: DeleteProductRequest): Promise<void> {
    const product = await this.productRepository.findById(productId)

    if (!product) {
      throw new AppError('Produto não encontrado.', 404)
    }

    try {
      await this.productRepository.delete(productId)
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && (error as any).code === 'P2003') {
        // P2003 = Foreign key constraint failed on the field: `orderId`
        // Fazemos soft-delete porque ele já possui pedidos vinculados
        await this.productRepository.softDelete(productId)
        return
      }
      throw error
    }
  }
}

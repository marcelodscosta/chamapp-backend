import { ICategoryRepository } from '../../repositories/interfaces/ICategoryRepository'
import { AppError } from '../errors/app-error'
import { Prisma } from '@prisma/client'

interface DeleteCategoryRequest {
  categoryId: string
}

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute({ categoryId }: DeleteCategoryRequest): Promise<void> {
    const category = await this.categoryRepository.findById(categoryId)

    if (!category) {
      throw new AppError('Categoria não encontrada.', 404)
    }

    try {
      await this.categoryRepository.delete(categoryId)
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && (error as any).code === 'P2003') {
        // P2003 = Foreign key constraint failed
        // Fazemos soft-delete porque ela já possui produtos vinculados
        await this.categoryRepository.softDelete(categoryId)
        return
      }
      throw error
    }
  }
}

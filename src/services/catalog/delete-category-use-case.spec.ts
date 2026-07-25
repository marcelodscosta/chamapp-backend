import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryCategoryRepository } from '../../repositories/in-memory/in-memory-category-repository'
import { DeleteCategoryUseCase } from './delete-category-use-case'
import { AppError } from '../errors/app-error'

let categoryRepository: InMemoryCategoryRepository
let sut: DeleteCategoryUseCase

describe('Delete Category Use Case', () => {
  beforeEach(() => {
    categoryRepository = new InMemoryCategoryRepository()
    sut = new DeleteCategoryUseCase(categoryRepository)
  })

  it('should be able to delete a category', async () => {
    const category = await categoryRepository.create({
      name: 'Bebidas',
    })

    await sut.execute({
      categoryId: category.id,
    })

    const categoryAfterDelete = await categoryRepository.findById(category.id)

    expect(categoryAfterDelete).toBeNull()
  })

  it('should not be able to delete a non-existing category', async () => {
    await expect(() =>
      sut.execute({
        categoryId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should soft delete the category if it has products (foreign key constraint)', async () => {
    const category = await categoryRepository.create({
      name: 'Gás',
    })

    // Simulando o erro do Prisma
    categoryRepository.delete = async () => {
      const error = new Error('Foreign key constraint') as any
      error.code = 'P2003'
      throw error
    }

    await sut.execute({
      categoryId: category.id,
    })

    const categoryAfterDelete = await categoryRepository.findById(category.id)

    expect(categoryAfterDelete).not.toBeNull()
    expect(categoryAfterDelete?.is_active).toBe(false)
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateCategoryUseCase } from './update-category-use-case'
import { InMemoryCategoryRepository } from '../../repositories/in-memory/in-memory-category-repository'
import { AppError } from '../errors/app-error'

let categoryRepository: InMemoryCategoryRepository
let sut: UpdateCategoryUseCase

describe('UpdateCategoryUseCase', () => {
  beforeEach(() => {
    categoryRepository = new InMemoryCategoryRepository()
    sut = new UpdateCategoryUseCase(categoryRepository)
  })

  it('deve atualizar o nome e a ordem da categoria', async () => {
    const category = await categoryRepository.create({
      name: 'Bebidas',
      order: 1,
    })

    const response = await sut.execute({
      categoryId: category.id,
      name: 'Bebidas Geladas',
      order: 2,
    })

    expect(response.category.name).toBe('Bebidas Geladas')
    expect(response.category.order).toBe(2)
  })

  it('deve lançar erro 404 se a categoria não existir', async () => {
    await expect(
      sut.execute({ categoryId: 'id-invalido', name: 'Teste' }),
    ).rejects.toBeInstanceOf(AppError)
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { CreateCategoryUseCase } from './create-category-use-case'
import { InMemoryCategoryRepository } from '../../repositories/in-memory/in-memory-category-repository'

let categoryRepository: InMemoryCategoryRepository
let sut: CreateCategoryUseCase

describe('CreateCategoryUseCase', () => {
  beforeEach(() => {
    categoryRepository = new InMemoryCategoryRepository()
    sut = new CreateCategoryUseCase(categoryRepository)
  })

  it('deve criar uma nova categoria', async () => {
    const { category } = await sut.execute({
      name: 'Bebidas',
      order: 1,
    })

    expect(category.id).toBeDefined()
    expect(category.name).toBe('Bebidas')
    expect(category.order).toBe(1)
  })
})

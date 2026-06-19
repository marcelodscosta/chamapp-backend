import { describe, it, expect, beforeEach } from 'vitest'
import { ListCategoriesUseCase } from './list-categories-use-case'
import { InMemoryCategoryRepository } from '../../repositories/in-memory/in-memory-category-repository'

let categoryRepository: InMemoryCategoryRepository
let sut: ListCategoriesUseCase

describe('ListCategoriesUseCase', () => {
  beforeEach(() => {
    categoryRepository = new InMemoryCategoryRepository()
    sut = new ListCategoriesUseCase(categoryRepository)
  })

  it('deve listar todas as categorias ordenadas pelo campo order', async () => {
    await categoryRepository.create({ name: 'Secos', order: 2 })
    await categoryRepository.create({ name: 'Bebidas', order: 1 })

    const { categories } = await sut.execute()

    expect(categories).toHaveLength(2)
    expect(categories[0].name).toBe('Bebidas') // order 1
    expect(categories[1].name).toBe('Secos')   // order 2
  })
})

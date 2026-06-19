import { describe, it, expect, beforeEach } from 'vitest'
import { CreateProductUseCase } from './create-product-use-case'
import { InMemoryProductRepository } from '../../repositories/in-memory/in-memory-product-repository'
import { InMemoryCategoryRepository } from '../../repositories/in-memory/in-memory-category-repository'
import { AppError } from '../errors/app-error'

let productRepository: InMemoryProductRepository
let categoryRepository: InMemoryCategoryRepository
let sut: CreateProductUseCase

describe('CreateProductUseCase', () => {
  beforeEach(() => {
    productRepository = new InMemoryProductRepository()
    categoryRepository = new InMemoryCategoryRepository()
    sut = new CreateProductUseCase(productRepository, categoryRepository)
  })

  it('deve criar um novo produto sem categoria', async () => {
    const { product } = await sut.execute({
      name: 'Botijão P13',
      price: 110.0,
      isAvailable: true,
    })

    expect(product.id).toBeDefined()
    expect(product.name).toBe('Botijão P13')
    expect(Number(product.price)).toBe(110.0)
  })

  it('deve lançar erro se a categoria informada não existir', async () => {
    await expect(
      sut.execute({
        categoryId: 'id-invalido',
        name: 'Botijão P13',
        price: 110.0,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})

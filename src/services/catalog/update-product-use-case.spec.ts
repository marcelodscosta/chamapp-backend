import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateProductUseCase } from './update-product-use-case'
import { InMemoryProductRepository } from '../../repositories/in-memory/in-memory-product-repository'
import { InMemoryCategoryRepository } from '../../repositories/in-memory/in-memory-category-repository'
import { AppError } from '../errors/app-error'

let productRepository: InMemoryProductRepository
let categoryRepository: InMemoryCategoryRepository
let sut: UpdateProductUseCase

describe('UpdateProductUseCase', () => {
  beforeEach(() => {
    productRepository = new InMemoryProductRepository()
    categoryRepository = new InMemoryCategoryRepository()
    sut = new UpdateProductUseCase(productRepository, categoryRepository)
  })

  it('deve atualizar o nome e preço do produto', async () => {
    const product = await productRepository.create({
      name: 'Agua',
      price: 10.0,
    })

    const response = await sut.execute({
      productId: product.id,
      name: 'Agua Mineral',
      price: 12.0,
    })

    expect(response.product.name).toBe('Agua Mineral')
    expect(Number(response.product.price)).toBe(12.0)
  })

  it('deve lançar erro 404 se o produto não existir', async () => {
    await expect(
      sut.execute({ productId: 'id-invalido', name: 'Teste' }),
    ).rejects.toBeInstanceOf(AppError)
  })
})

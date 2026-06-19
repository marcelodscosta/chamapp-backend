import { describe, it, expect, beforeEach } from 'vitest'
import { GetProductUseCase } from './get-product-use-case'
import { InMemoryProductRepository } from '../../repositories/in-memory/in-memory-product-repository'
import { AppError } from '../errors/app-error'

let productRepository: InMemoryProductRepository
let sut: GetProductUseCase

describe('GetProductUseCase', () => {
  beforeEach(() => {
    productRepository = new InMemoryProductRepository()
    sut = new GetProductUseCase(productRepository)
  })

  it('deve obter os detalhes de um produto', async () => {
    const createdProduct = await productRepository.create({
      name: 'Produto X',
      price: 50.0,
    })

    const { product } = await sut.execute({ productId: createdProduct.id })

    expect(product.id).toBe(createdProduct.id)
    expect(product.name).toBe('Produto X')
  })

  it('deve lançar erro 404 se o produto não existir', async () => {
    await expect(
      sut.execute({ productId: 'id-invalido' }),
    ).rejects.toBeInstanceOf(AppError)
  })
})

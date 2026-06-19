import { describe, it, expect, beforeEach } from 'vitest'
import { ToggleProductAvailabilityUseCase } from './toggle-product-availability-use-case'
import { InMemoryProductRepository } from '../../repositories/in-memory/in-memory-product-repository'
import { AppError } from '../errors/app-error'

let productRepository: InMemoryProductRepository
let sut: ToggleProductAvailabilityUseCase

describe('ToggleProductAvailabilityUseCase', () => {
  beforeEach(() => {
    productRepository = new InMemoryProductRepository()
    sut = new ToggleProductAvailabilityUseCase(productRepository)
  })

  it('deve alterar a disponibilidade de um produto', async () => {
    const product = await productRepository.create({
      name: 'Agua',
      price: 10.0,
      is_available: true,
    })

    const response = await sut.execute({ productId: product.id })
    expect(response.product.is_available).toBe(false)
  })

  it('deve lançar erro 404 se o produto não existir', async () => {
    await expect(
      sut.execute({ productId: 'id-invalido' }),
    ).rejects.toBeInstanceOf(AppError)
  })
})

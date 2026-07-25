import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryProductRepository } from '../../repositories/in-memory/in-memory-product-repository'
import { DeleteProductUseCase } from './delete-product-use-case'
import { AppError } from '../errors/app-error'
import { Prisma } from '@prisma/client'

let productRepository: InMemoryProductRepository
let sut: DeleteProductUseCase

describe('Delete Product Use Case', () => {
  beforeEach(() => {
    productRepository = new InMemoryProductRepository()
    sut = new DeleteProductUseCase(productRepository)
  })

  it('should be able to delete a product', async () => {
    const product = await productRepository.create({
      name: 'Água Mineral 20L',
      price: 15.0,
      requires_empty_return: true,
    })

    await sut.execute({
      productId: product.id,
    })

    const productAfterDelete = await productRepository.findById(product.id)

    expect(productAfterDelete).toBeNull()
  })

  it('should not be able to delete a non-existing product', async () => {
    await expect(() =>
      sut.execute({
        productId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should soft delete the product if it has orders (foreign key constraint)', async () => {
    const product = await productRepository.create({
      name: 'Gás de Cozinha 13kg',
      price: 110.0,
    })

    // Simulando o erro do Prisma
    productRepository.delete = async () => {
      const error = new Error('Foreign key constraint') as any
      error.code = 'P2003'
      throw error
    }

    await sut.execute({
      productId: product.id,
    })

    const productAfterDelete = await productRepository.findById(product.id)

    expect(productAfterDelete).not.toBeNull()
    expect(productAfterDelete?.is_active).toBe(false)
    expect(productAfterDelete?.is_available).toBe(false)
  })
})

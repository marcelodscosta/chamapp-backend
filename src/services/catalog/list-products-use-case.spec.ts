import { describe, it, expect, beforeEach } from 'vitest'
import { ListProductsUseCase } from './list-products-use-case'
import { InMemoryProductRepository } from '../../repositories/in-memory/in-memory-product-repository'

let productRepository: InMemoryProductRepository
let sut: ListProductsUseCase

describe('ListProductsUseCase', () => {
  beforeEach(() => {
    productRepository = new InMemoryProductRepository()
    sut = new ListProductsUseCase(productRepository)
  })

  it('deve listar produtos paginados', async () => {
    for (let i = 1; i <= 15; i++) {
      await productRepository.create({
        name: `Produto ${i.toString().padStart(2, '0')}`,
        price: 10.0,
      })
    }

    const { products, total } = await sut.execute({ page: 1, limit: 10 })

    expect(total).toBe(15)
    expect(products).toHaveLength(10)
    expect(products[0].name).toBe('Produto 01')
  })

  it('deve filtrar produtos apenas disponíveis', async () => {
    await productRepository.create({
      name: 'Disp',
      price: 10,
      is_available: true,
    })
    await productRepository.create({
      name: 'Indisp',
      price: 10,
      is_available: false,
    })

    const { products, total } = await sut.execute({ onlyAvailable: true })

    expect(total).toBe(1)
    expect(products[0].name).toBe('Disp')
  })
})

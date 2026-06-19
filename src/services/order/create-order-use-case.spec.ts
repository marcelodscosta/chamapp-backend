import { describe, it, expect, beforeEach } from 'vitest'
import { CreateOrderUseCase } from './create-order-use-case'
import { InMemoryOrderRepository } from '../../repositories/in-memory/in-memory-order-repository'
import { InMemoryProductRepository } from '../../repositories/in-memory/in-memory-product-repository'
import { InMemoryAddressRepository } from '../../repositories/in-memory/in-memory-address-repository'
import { AppError } from '../errors/app-error'

let orderRepository: InMemoryOrderRepository
let productRepository: InMemoryProductRepository
let addressRepository: InMemoryAddressRepository
let sut: CreateOrderUseCase

describe('CreateOrderUseCase', () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    productRepository = new InMemoryProductRepository()
    addressRepository = new InMemoryAddressRepository()
    sut = new CreateOrderUseCase(
      orderRepository,
      productRepository,
      addressRepository,
    )
  })

  it('deve criar um novo pedido com sucesso', async () => {
    const product = await productRepository.create({
      name: 'Botijão P13',
      price: 110.0,
      is_available: true,
    })

    const address = await addressRepository.create({
      customerId: 'user-1',
      street: 'Rua A',
      number: '1',
      neighborhood: 'B',
      city: 'C',
      state: 'SP',
      zip_code: '123',
    })

    const { order } = await sut.execute({
      customerId: 'user-1',
      addressId: address.id,
      paymentMethod: 'PIX',
      deliveryFee: 10.0,
      items: [
        {
          productId: product.id,
          quantity: 2,
        },
      ],
    })

    expect(order.id).toBeDefined()
    expect(Number(order.subtotal)).toBe(220.0) // 110 * 2
    expect(Number(order.total_value)).toBe(230.0) // 220 + 10
  })

  it('deve lançar erro se o produto estiver indisponível', async () => {
    const product = await productRepository.create({
      name: 'Botijão P13',
      price: 110.0,
      is_available: false,
    })

    const address = await addressRepository.create({
      customerId: 'user-1',
      street: 'Rua A',
      number: '1',
      neighborhood: 'B',
      city: 'C',
      state: 'SP',
      zip_code: '123',
    })

    await expect(
      sut.execute({
        customerId: 'user-1',
        addressId: address.id,
        paymentMethod: 'PIX',
        deliveryFee: 10.0,
        items: [
          {
            productId: product.id,
            quantity: 1,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { ListOrdersUseCase } from './list-orders-use-case'
import { InMemoryOrderRepository } from '../../repositories/in-memory/in-memory-order-repository'

let orderRepository: InMemoryOrderRepository
let sut: ListOrdersUseCase

describe('ListOrdersUseCase', () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    sut = new ListOrdersUseCase(orderRepository)
  })

  it('deve listar pedidos de um cliente específico', async () => {
    await orderRepository.create({
      customerId: 'user-1',
      addressId: 'addr-1',
      payment_method: 'PIX',
      subtotal: 100,
      delivery_fee: 10,
      total_value: 110,
      items: [],
    })

    await orderRepository.create({
      customerId: 'user-2',
      addressId: 'addr-1',
      payment_method: 'PIX',
      subtotal: 100,
      delivery_fee: 10,
      total_value: 110,
      items: [],
    })

    const { orders } = await sut.execute({ customerId: 'user-1' })

    expect(orders).toHaveLength(1)
    expect(orders[0].customerId).toBe('user-1')
  })
})

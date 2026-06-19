import { describe, it, expect, beforeEach } from 'vitest'
import { GetOrderDetailsUseCase } from './get-order-details-use-case'
import { InMemoryOrderRepository } from '../../repositories/in-memory/in-memory-order-repository'
import { Role } from '../../generated/prisma'

let orderRepository: InMemoryOrderRepository
let sut: GetOrderDetailsUseCase

describe('GetOrderDetailsUseCase', () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    sut = new GetOrderDetailsUseCase(orderRepository)
  })

  it('deve obter os detalhes de um pedido existente', async () => {
    const order = await orderRepository.create({
      customerId: 'user-1',
      addressId: 'addr-1',
      payment_method: 'PIX',
      subtotal: 100,
      delivery_fee: 10,
      total_value: 110,
      items: [],
    })

    const response = await sut.execute({
      orderId: order.id,
      userId: 'user-1',
      userRole: Role.CUSTOMER,
    })

    expect(response.order.id).toBe(order.id)
  })
})

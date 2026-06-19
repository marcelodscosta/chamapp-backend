import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateOrderStatusUseCase } from './update-order-status-use-case'
import { InMemoryOrderRepository } from '../../repositories/in-memory/in-memory-order-repository'
import { OrderStatus, Role } from '../../generated/prisma'
import { AppError } from '../errors/app-error'

let orderRepository: InMemoryOrderRepository
let sut: UpdateOrderStatusUseCase

describe('UpdateOrderStatusUseCase', () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    sut = new UpdateOrderStatusUseCase(orderRepository)
  })

  it('admin deve conseguir alterar status livremente', async () => {
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
      userId: 'admin-1',
      userRole: Role.ADMIN,
      newStatus: OrderStatus.CONFIRMED,
    })

    expect(response.order.status).toBe(OrderStatus.CONFIRMED)
    expect(response.order.confirmed_at).toBeDefined()
  })

  it('cliente não deve conseguir confirmar pedido', async () => {
    const order = await orderRepository.create({
      customerId: 'user-1',
      addressId: 'addr-1',
      payment_method: 'PIX',
      subtotal: 100,
      delivery_fee: 10,
      total_value: 110,
      items: [],
    })

    await expect(
      sut.execute({
        orderId: order.id,
        userId: 'user-1',
        userRole: Role.CUSTOMER,
        newStatus: OrderStatus.CONFIRMED,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})

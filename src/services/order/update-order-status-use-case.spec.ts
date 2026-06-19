import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateOrderStatusUseCase } from './update-order-status-use-case'
import { InMemoryOrderRepository } from '../../repositories/in-memory/in-memory-order-repository'
import { InMemoryPushTokenRepository } from '../../repositories/in-memory/in-memory-push-token-repository'
import {
  IPushNotificationProvider,
  SendPushMessage,
} from '../../providers/PushNotificationProvider/IPushNotificationProvider'
import { OrderStatus, Role } from '../../generated/prisma'
import { AppError } from '../errors/app-error'

class MockPushProvider implements IPushNotificationProvider {
  public messages: SendPushMessage[] = []
  async send(message: SendPushMessage): Promise<void> {
    this.messages.push(message)
  }
}

let orderRepository: InMemoryOrderRepository
let pushTokenRepository: InMemoryPushTokenRepository
let pushProvider: MockPushProvider
let sut: UpdateOrderStatusUseCase

describe('UpdateOrderStatusUseCase', () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    pushTokenRepository = new InMemoryPushTokenRepository()
    pushProvider = new MockPushProvider()
    sut = new UpdateOrderStatusUseCase(
      orderRepository,
      pushTokenRepository,
      pushProvider,
    )
  })

  it('admin deve conseguir alterar status livremente e notificar cliente', async () => {
    const order = await orderRepository.create({
      customerId: 'user-1',
      addressId: 'addr-1',
      payment_method: 'PIX',
      subtotal: 100,
      delivery_fee: 10,
      total_value: 110,
      items: [],
    })

    await pushTokenRepository.save({
      userId: 'user-1',
      token: 'token-abc',
      platform: 'ANDROID',
    })

    const response = await sut.execute({
      orderId: order.id,
      userId: 'admin-1',
      userRole: Role.ADMIN,
      newStatus: OrderStatus.CONFIRMED,
    })

    expect(response.order.status).toBe(OrderStatus.CONFIRMED)
    expect(response.order.confirmed_at).toBeDefined()
    expect(pushProvider.messages).toHaveLength(1)
    expect(pushProvider.messages[0].tokens).toContain('token-abc')
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

import { Order, OrderStatus, Role } from '../../generated/prisma'
import { IOrderRepository } from '../../repositories/interfaces/IOrderRepository'
import { IPushTokenRepository } from '../../repositories/interfaces/IPushTokenRepository'
import { IPushNotificationProvider } from '../../providers/PushNotificationProvider/IPushNotificationProvider'
import { ILoyaltyRepository } from '../../repositories/interfaces/ILoyaltyRepository'
import { AddPointsTransactionUseCase } from '../loyalty/add-points-transaction-use-case'
import { appEvents } from '../../lib/events'
import { AppError } from '../errors/app-error'

interface UpdateOrderStatusRequest {
  orderId: string
  userId: string
  userRole: Role
  newStatus: OrderStatus
  cancellationReason?: string
  deliveryPersonId?: string // Usado quando CONFIRMED -> OUT_FOR_DELIVERY para designar motoboy
}

interface UpdateOrderStatusResponse {
  order: Order
}

export class UpdateOrderStatusUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private pushTokenRepository: IPushTokenRepository,
    private pushNotificationProvider: IPushNotificationProvider,
    private loyaltyRepository: ILoyaltyRepository,
  ) {}

  async execute({
    orderId,
    userId,
    userRole,
    newStatus,
    cancellationReason,
    deliveryPersonId,
  }: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      throw new AppError('Pedido não encontrado.', 404)
    }

    // Regras de RBAC e Máquina de Estados
    // CUSTOMER só pode CANCELAR se estiver PENDING
    if (userRole === Role.CUSTOMER) {
      if (newStatus !== OrderStatus.CANCELLED) {
        throw new AppError('Clientes só podem cancelar pedidos.', 403)
      }
      if (order.status !== OrderStatus.PENDING) {
        throw new AppError(
          'Pedido não pode mais ser cancelado pelo cliente.',
          400,
        )
      }
      if (order.customerId !== userId) {
        throw new AppError('Acesso não autorizado.', 403)
      }
    }

    // DELIVERY só pode atualizar para DELIVERED (e só se o pedido for dele)
    if (userRole === Role.DELIVERY) {
      if (newStatus !== OrderStatus.DELIVERED) {
        throw new AppError(
          'Entregadores só podem marcar pedidos como entregues.',
          403,
        )
      }
      if (order.deliveryPersonId !== userId) {
        throw new AppError('Este pedido não está designado para você.', 403)
      }
    }

    const updateData: Partial<Order> = {}

    // Tratamento das datas por status
    if (newStatus === OrderStatus.CONFIRMED) {
      updateData.confirmed_at = new Date()
    } else if (newStatus === OrderStatus.OUT_FOR_DELIVERY) {
      updateData.dispatched_at = new Date()
      if (deliveryPersonId) {
        updateData.deliveryPersonId = deliveryPersonId
      }
    } else if (newStatus === OrderStatus.DELIVERED) {
      updateData.delivered_at = new Date()
      // Lógica de pagamento para entregas via maquininha/dinheiro:
      if (!order.payment_confirmed) {
        updateData.payment_confirmed = true
      }

      // Fidelidade: Adiciona pontos quando o pedido é entregue
      try {
        const config = await this.loyaltyRepository.getConfig()
        if (config?.program_enabled && order.customerId) {
          // Regra de negócio: se utilizou pontos na compra, não ganha novos pontos
          if (order.points_redeemed === 0) {
            const addPoints = new AddPointsTransactionUseCase(
              this.loyaltyRepository,
            )
            // Exemplo básico: converte subtotal para pontos baseado em points_per_real
            const pointsEarned = Math.floor(
              Number(order.subtotal) * Number(config.points_per_real),
            )

            if (pointsEarned > 0) {
              updateData.points_earned = pointsEarned
              await addPoints.execute({
                customerId: order.customerId,
                orderId: order.id,
                points: pointsEarned,
                description: `Pedido ${order.order_number}`,
              })
            }
          }
        }
      } catch (err) {
        console.error('Erro ao processar fidelidade:', err)
      }
    } else if (newStatus === OrderStatus.CANCELLED) {
      updateData.cancelled_at = new Date()
      updateData.cancellation_reason = cancellationReason
    }

    const updatedOrder = await this.orderRepository.updateStatus(
      orderId,
      newStatus,
      updateData,
    )

    // Enviar Push Notification
    // Se o pedido mudou de status e o cliente for o dono, enviaremos notificação para o cliente
    // Ignoramos quando o próprio cliente cancela (para não spammar ele mesmo)
    if (userRole !== Role.CUSTOMER) {
      const tokens = await this.pushTokenRepository.findByUserId(
        order.customerId,
      )

      if (tokens.length > 0) {
        let title = 'Atualização do Pedido'
        let body = `Seu pedido ${order.order_number} teve o status atualizado.`

        if (newStatus === OrderStatus.CONFIRMED) {
          title = 'Pedido Confirmado! ✅'
          body = `Seu pedido ${order.order_number} foi confirmado e está sendo preparado.`
        } else if (newStatus === OrderStatus.OUT_FOR_DELIVERY) {
          title = 'Saiu para Entrega! 🛵'
          body = `Seu pedido ${order.order_number} está a caminho.`
        } else if (newStatus === OrderStatus.DELIVERED) {
          title = 'Pedido Entregue! 🎉'
          body = `Seu pedido ${order.order_number} foi entregue com sucesso.`
        } else if (newStatus === OrderStatus.CANCELLED) {
          title = 'Pedido Cancelado ❌'
          body = `Seu pedido ${order.order_number} foi cancelado.`
        }

        await this.pushNotificationProvider.send({
          tokens: tokens.map((t) => t.token),
          title,
          body,
          data: { orderId: order.id, status: newStatus },
        })
      }
    }

    appEvents.emit('order:status_updated', updatedOrder)

    return { order: updatedOrder }
  }
}

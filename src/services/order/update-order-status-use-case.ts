import { Order, OrderStatus, Role } from '../../generated/prisma'
import { IOrderRepository } from '../../repositories/interfaces/IOrderRepository'
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
  constructor(private orderRepository: IOrderRepository) {}

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
    } else if (newStatus === OrderStatus.CANCELLED) {
      updateData.cancelled_at = new Date()
      updateData.cancellation_reason = cancellationReason
    }

    const updatedOrder = await this.orderRepository.updateStatus(
      orderId,
      newStatus,
      updateData,
    )

    return { order: updatedOrder }
  }
}

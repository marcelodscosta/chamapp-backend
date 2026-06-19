import {
  OrderWithItems,
  IOrderRepository,
} from '../../repositories/interfaces/IOrderRepository'
import { AppError } from '../errors/app-error'
import { Role } from '../../generated/prisma'

interface GetOrderDetailsRequest {
  orderId: string
  userId: string
  userRole: Role
}

interface GetOrderDetailsResponse {
  order: OrderWithItems
}

export class GetOrderDetailsUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute({
    orderId,
    userId,
    userRole,
  }: GetOrderDetailsRequest): Promise<GetOrderDetailsResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      throw new AppError('Pedido não encontrado.', 404)
    }

    // Regras de acesso
    if (userRole === Role.CUSTOMER && order.customerId !== userId) {
      throw new AppError('Acesso não autorizado.', 403)
    }

    if (userRole === Role.DELIVERY && order.deliveryPersonId !== userId) {
      // Entregadores só veem seus próprios pedidos (ou a loja aberta via outro UC)
      // Aqui vamos restringir
      throw new AppError('Acesso não autorizado.', 403)
    }

    return { order }
  }
}

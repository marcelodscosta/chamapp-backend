import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateOrder } from '../../../services/factories/make-create-order'
import { makeUpdateOrderStatus } from '../../../services/factories/make-update-order-status'
import { makeGetOrderDetails } from '../../../services/factories/make-get-order-details'
import { makeListOrders } from '../../../services/factories/make-list-orders'
import { OrderStatus, PaymentMethod, Role } from '../../../generated/prisma'

const createOrderBodySchema = z.object({
  addressId: z.string().uuid(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  changeFor: z.number().positive().optional(),
  hasEmptyCylinder: z.boolean().optional(),
  deliveryFee: z.number().min(0),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
        notes: z.string().optional(),
      }),
    )
    .min(1, 'Adicione pelo menos um item ao pedido'),
})

export async function createOrder(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = createOrderBodySchema.parse(request.body)

  const useCase = makeCreateOrder()
  const { order } = await useCase.execute({
    customerId: request.user!.id,
    ...data,
  })

  return reply.status(201).send({ order })
}

const listOrdersQuerySchema = z.object({
  customerId: z.string().uuid().optional(),
  deliveryPersonId: z.string().uuid().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).optional(),
})

export async function listOrders(request: FastifyRequest, reply: FastifyReply) {
  const query = listOrdersQuerySchema.parse(request.query)

  // Segurança: CUSTOMER só vê seus pedidos, DELIVERY só vê seus pedidos
  if (request.user!.role === Role.CUSTOMER) {
    query.customerId = request.user!.id
  } else if (request.user!.role === Role.DELIVERY) {
    query.deliveryPersonId = request.user!.id
  }

  const useCase = makeListOrders()
  const result = await useCase.execute(query)

  return reply.status(200).send(result)
}

const getOrderParamsSchema = z.object({
  id: z.string().uuid(),
})

export async function getOrder(request: FastifyRequest, reply: FastifyReply) {
  const { id } = getOrderParamsSchema.parse(request.params)

  const useCase = makeGetOrderDetails()
  const { order } = await useCase.execute({
    orderId: id,
    userId: request.user!.id,
    userRole: request.user!.role,
  })

  return reply.status(200).send({ order })
}

const updateStatusParamsSchema = z.object({
  id: z.string().uuid(),
})

const updateStatusBodySchema = z.object({
  status: z.nativeEnum(OrderStatus),
  cancellationReason: z.string().optional(),
  deliveryPersonId: z.string().uuid().optional(),
})

export async function updateOrderStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateStatusParamsSchema.parse(request.params)
  const { status, cancellationReason, deliveryPersonId } =
    updateStatusBodySchema.parse(request.body)

  const useCase = makeUpdateOrderStatus()
  const { order } = await useCase.execute({
    orderId: id,
    userId: request.user!.id,
    userRole: request.user!.role,
    newStatus: status,
    cancellationReason,
    deliveryPersonId,
  })

  return reply.status(200).send({ order })
}

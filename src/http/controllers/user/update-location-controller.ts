import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

const ACTIVE_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY']

const updateLocationBodySchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

export async function updateLocationController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user!.id
  const { latitude, longitude } = updateLocationBodySchema.parse(request.body)

  // Verifica se o usuário tem algum pedido ativo
  const activeOrder = await prisma.order.findFirst({
    where: {
      customerId: userId,
      status: { in: ACTIVE_STATUSES as any },
    },
    select: { id: true },
  })

  // Upsert: cria ou atualiza a localização do usuário
  await prisma.userLocation.upsert({
    where: { userId },
    create: {
      userId,
      latitude,
      longitude,
      has_active_order: !!activeOrder,
      last_seen_at: new Date(),
    },
    update: {
      latitude,
      longitude,
      has_active_order: !!activeOrder,
      last_seen_at: new Date(),
    },
  })

  return reply.status(204).send()
}

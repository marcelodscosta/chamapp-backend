import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../../../lib/prisma'

// Usuários considerados "online" se enviaram localização nos últimos 5 minutos
const ONLINE_THRESHOLD_MS = 5 * 60 * 1000

export async function getUserLocationsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const since = new Date(Date.now() - ONLINE_THRESHOLD_MS)

  const locations = await prisma.userLocation.findMany({
    where: {
      last_seen_at: { gte: since },
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  })

  const result = locations.map((loc) => ({
    userId: loc.userId,
    name: loc.user.name,
    email: loc.user.email,
    phone: loc.user.phone,
    latitude: loc.latitude,
    longitude: loc.longitude,
    has_active_order: loc.has_active_order,
    last_seen_at: loc.last_seen_at,
  }))

  return reply.send({ users: result })
}

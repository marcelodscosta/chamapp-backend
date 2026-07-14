import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../../../lib/prisma'

export async function listTeamController(request: FastifyRequest, reply: FastifyReply) {
  const users = await prisma.user.findMany({
    where: {
      role: {
        not: 'CUSTOMER',
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      is_active: true,
      created_at: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  })

  return reply.send({ users })
}

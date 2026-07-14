import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

const toggleParamsSchema = z.object({
  id: z.string().uuid(),
})

export async function toggleStatusController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = toggleParamsSchema.parse(request.params)

  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    return reply.status(404).send({ message: 'Usuário não encontrado.' })
  }

  if (user.role === 'CUSTOMER') {
    return reply.status(400).send({ message: 'Ação não permitida para clientes.' })
  }

  if (user.id === request.user!.id) {
    return reply.status(400).send({ message: 'Você não pode bloquear a si mesmo.' })
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      is_active: !user.is_active,
    },
    select: {
      id: true,
      is_active: true,
    }
  })

  return reply.send({ user: updatedUser })
}

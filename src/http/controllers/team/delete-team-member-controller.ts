import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

const deleteParamsSchema = z.object({
  id: z.string().uuid(),
})

export async function deleteTeamMemberController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = deleteParamsSchema.parse(request.params)

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      deliveries: true,
    }
  })

  if (!user) {
    return reply.status(404).send({ message: 'Usuário não encontrado.' })
  }

  if (user.role === 'CUSTOMER') {
    return reply.status(400).send({ message: 'Ação não permitida para clientes.' })
  }

  if (user.id === request.user!.id) {
    return reply.status(400).send({ message: 'Você não pode excluir a si mesmo.' })
  }

  if (user.deliveries && user.deliveries.length > 0) {
    return reply.status(400).send({ message: 'Não é possível excluir este usuário pois ele possui entregas vinculadas. Recomendamos apenas bloqueá-lo.' })
  }

  await prisma.user.delete({
    where: { id },
  })

  return reply.status(204).send()
}

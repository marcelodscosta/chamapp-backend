import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { UpdateTeamMemberUseCase } from '../../../services/user/update-team-member-use-case'
import { prisma } from '../../../lib/prisma'
import { Role } from '../../../generated/prisma'

const updateTeamSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional().or(z.literal('')),
  phone: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
})

export async function updateTeamMemberController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const { name, email, password, phone, role } = updateTeamSchema.parse(request.body)

  const updateTeamMemberUseCase = new UpdateTeamMemberUseCase(prisma)

  // Se a senha vier vazia do frontend, não passamos adiante para não sobrescrever
  const finalPassword = password && password.trim() !== '' ? password : undefined

  const { user } = await updateTeamMemberUseCase.execute({
    adminId: request.user!.id,
    memberId: id,
    name,
    email,
    password: finalPassword,
    phone,
    role,
  })

  return reply.status(200).send({ user })
}

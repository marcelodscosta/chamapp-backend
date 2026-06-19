import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeListUsers } from '../../../services/factories/make-list-users'
import { makeCreateStaffUser } from '../../../services/factories/make-create-staff-user'
import { makeToggleUserStatus } from '../../../services/factories/make-toggle-user-status'
import { Role } from '../../../generated/prisma'

export async function listUsers(_request: FastifyRequest, reply: FastifyReply) {
  const useCase = makeListUsers()
  const { users } = await useCase.execute()

  return reply.status(200).send({ users })
}

const createStaffBodySchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres.'),
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(6).optional(),
  phone: z.string().optional(),
  role: z.enum([Role.ADMIN, Role.OPERATOR, Role.DELIVERY]),
})

export async function createStaff(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { name, email, password, phone, role } = createStaffBodySchema.parse(
    request.body,
  )

  const useCase = makeCreateStaffUser()
  const { user } = await useCase.execute({
    name,
    email,
    password,
    phone,
    role,
  })

  return reply.status(201).send({ user })
}

const toggleStatusParamsSchema = z.object({
  id: z.string().uuid('ID inválido.'),
})

export async function toggleStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = toggleStatusParamsSchema.parse(request.params)

  const useCase = makeToggleUserStatus()
  const { user } = await useCase.execute({ userId: id })

  return reply.status(200).send({ user })
}

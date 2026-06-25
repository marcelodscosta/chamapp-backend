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

import { makeUpdateUserProfile } from '../../../services/factories/make-update-user-profile'

export async function toggleStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = toggleStatusParamsSchema.parse(request.params)

  const useCase = makeToggleUserStatus()
  const { user } = await useCase.execute({ userId: id })

  return reply.status(200).send({ user })
}

const updateUserParamsSchema = z.object({
  id: z.string().uuid('ID inválido.'),
})

const updateUserBodySchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres.').optional(),
  email: z.string().email('E-mail inválido.').optional(),
  phone: z.string().optional(),
})

export async function updateUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateUserParamsSchema.parse(request.params)
  const { name, email, phone } = updateUserBodySchema.parse(request.body)

  const useCase = makeUpdateUserProfile()
  const { user } = await useCase.execute({
    userId: id,
    name,
    email,
    phone,
  })

  return reply.status(200).send({ user })
}

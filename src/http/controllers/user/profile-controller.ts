import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetUserProfile } from '../../../services/factories/make-get-user-profile'
import { makeUpdateUserProfile } from '../../../services/factories/make-update-user-profile'

export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.id

  if (!userId) {
    return reply.status(401).send({ message: 'Não autenticado.' })
  }

  const useCase = makeGetUserProfile()
  const { user } = await useCase.execute({ userId })

  return reply.status(200).send({ user })
}

const updateProfileBodySchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  password: z.string().min(6).optional(),
  avatarUrl: z.string().url().optional(),
})

export async function updateProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user?.id

  if (!userId) {
    return reply.status(401).send({ message: 'Não autenticado.' })
  }

  const { name, phone, password, avatarUrl } = updateProfileBodySchema.parse(
    request.body,
  )

  const useCase = makeUpdateUserProfile()
  const { user } = await useCase.execute({
    userId,
    name,
    phone,
    password,
    avatarUrl,
  })

  return reply.status(200).send({ user })
}

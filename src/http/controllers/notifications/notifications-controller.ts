import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import {
  makeRegisterPushToken,
  makeRemovePushToken,
} from '../../../services/factories/make-push-tokens'
import { Platform } from '../../../generated/prisma'

const registerTokenBodySchema = z.object({
  token: z.string(),
  platform: z.nativeEnum(Platform),
})

export async function registerPushToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { token, platform } = registerTokenBodySchema.parse(request.body)

  const useCase = makeRegisterPushToken()
  const { pushToken } = await useCase.execute({
    userId: request.user!.id,
    token,
    platform,
  })

  return reply.status(201).send({ pushToken })
}

const removeTokenBodySchema = z.object({
  token: z.string(),
})

export async function removePushToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { token } = removeTokenBodySchema.parse(request.body)

  const useCase = makeRemovePushToken()
  await useCase.execute({
    userId: request.user!.id,
    token,
  })

  return reply.status(204).send()
}

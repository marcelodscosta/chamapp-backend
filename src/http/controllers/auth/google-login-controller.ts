import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeAuthenticateGoogle } from '../../../services/factories/make-authenticate-google'

const googleLoginBodySchema = z.object({
  idToken: z.string().min(1, 'Token obrigatório.'),
})

export async function googleLoginController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { idToken } = googleLoginBodySchema.parse(request.body)

  const useCase = makeAuthenticateGoogle()
  const { token, user } = await useCase.execute({ idToken })

  return reply.status(200).send({
    token,
    user,
  })
}

import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeAuthenticate } from '../../../services/factories/make-authenticate'

const loginBodySchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(1, 'Senha obrigatória.'),
})

export async function loginController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = loginBodySchema.parse(request.body)

  const useCase = makeAuthenticate()
  const { token, user } = await useCase.execute({ email, password })

  return reply.status(200).send({
    token,
    user,
  })
}

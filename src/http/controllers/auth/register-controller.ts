import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeRegisterCustomer } from '../../../services/factories/make-register-customer'

const registerBodySchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres.'),
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres.'),
  phone: z.string().optional(),
})

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { name, email, password, phone } = registerBodySchema.parse(
    request.body,
  )

  const useCase = makeRegisterCustomer()
  const { user } = await useCase.execute({ name, email, password, phone })

  return reply.status(201).send({
    user,
  })
}

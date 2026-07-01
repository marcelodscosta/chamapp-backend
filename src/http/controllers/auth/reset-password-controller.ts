import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeResetPassword } from '../../../services/factories/make-reset-password'

const resetPasswordBodySchema = z.object({
  email: z.string().email('E-mail inválido.'),
  code: z.string().min(6, 'Código inválido.'),
  newPassword: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
})

export async function resetPasswordController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, code, newPassword } = resetPasswordBodySchema.parse(request.body)

  const useCase = makeResetPassword()
  await useCase.execute({ email, code, newPassword })

  return reply.status(200).send({
    message: 'Senha alterada com sucesso.',
  })
}

import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeSendOtp } from '../../../services/factories/make-send-otp'

const sendOtpBodySchema = z.object({
  email: z.string().email('E-mail inválido.'),
})

export async function sendOtpController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email } = sendOtpBodySchema.parse(request.body)

  const useCase = makeSendOtp()
  await useCase.execute({ email })

  return reply.status(200).send({
    message: 'Se o e-mail existir, um código foi enviado.',
  })
}

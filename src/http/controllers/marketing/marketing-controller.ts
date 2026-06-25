import { FastifyReply, FastifyRequest } from 'fastify'
import { makeSendMarketingPush } from '../../../services/factories/make-send-marketing-push'
import { z } from 'zod'

export async function sendMarketingPush(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sendMarketingPushBodySchema = z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    imageUrl: z.string().url().optional().or(z.literal('')),
    filter: z.enum(['ALL', 'NEVER_BOUGHT', 'INACTIVE_30_DAYS']),
  })

  const { title, body, imageUrl, filter } = sendMarketingPushBodySchema.parse(
    request.body,
  )

  const sendMarketingPushUseCase = makeSendMarketingPush()

  // request.user.id contém o ID do admin
  const result = await sendMarketingPushUseCase.execute({
    adminId: request.user!.id,
    title,
    body,
    imageUrl: imageUrl && imageUrl.trim() !== '' ? imageUrl : undefined,
    filter,
  })

  return reply.status(200).send(result)
}

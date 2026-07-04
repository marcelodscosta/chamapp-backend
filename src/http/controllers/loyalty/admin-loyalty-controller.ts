import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetLoyaltyStatement } from '../../../services/factories/make-get-loyalty-statement'
import { makeResetLoyaltyPoints } from '../../../services/factories/make-reset-loyalty-points'

const paramsSchema = z.object({
  customerId: z.string().uuid(),
})

export async function getLoyaltyStatement(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { customerId } = paramsSchema.parse(request.params)

  const useCase = makeGetLoyaltyStatement()
  const { transactions, account } = await useCase.execute({ customerId })

  return reply.status(200).send({ transactions, account })
}

export async function resetLoyaltyPoints(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { customerId } = paramsSchema.parse(request.params)
  const adminId = request.user!.id

  const useCase = makeResetLoyaltyPoints()
  const { transaction, account } = await useCase.execute({
    customerId,
    adminId,
  })

  return reply.status(200).send({ transaction, account })
}

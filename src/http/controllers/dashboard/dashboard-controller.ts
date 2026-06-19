import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetDashboardMetrics } from '../../../services/factories/make-dashboard'

const getMetricsQuerySchema = z.object({
  days: z.coerce.number().min(1).max(365).optional(),
})

export async function getDashboardMetrics(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { days } = getMetricsQuerySchema.parse(request.query)

  const useCase = makeGetDashboardMetrics()
  const { metrics } = await useCase.execute({ days })

  return reply.status(200).send({ metrics })
}

import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetDashboardMetrics } from '../../../services/factories/make-dashboard'

const getMetricsQuerySchema = z.object({
  days: z.coerce.number().min(0).max(365).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export async function getDashboardMetrics(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { days, startDate, endDate } = getMetricsQuerySchema.parse(request.query)

  const useCase = makeGetDashboardMetrics()
  const { metrics } = await useCase.execute({ days, startDate, endDate })

  return reply.status(200).send({ metrics })
}

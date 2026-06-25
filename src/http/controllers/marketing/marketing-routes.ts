import { FastifyInstance } from 'fastify'
import { requireRole } from '../../middleware/auth'
import { Role } from '../../../generated/prisma'
import { sendMarketingPush } from './marketing-controller'

export async function marketingRoutes(app: FastifyInstance) {
  // Somente ADMIN pode disparar push de marketing
  app.post(
    '/marketing/push',
    { preHandler: [requireRole(Role.ADMIN)] },
    sendMarketingPush,
  )
}

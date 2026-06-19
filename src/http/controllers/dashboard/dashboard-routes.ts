import { FastifyInstance } from 'fastify'
import { getDashboardMetrics } from './dashboard-controller'
import { requireRole } from '../../middleware/auth'
import { Role } from '../../../generated/prisma'

export async function dashboardRoutes(app: FastifyInstance) {
  // Apenas admins ou operadores podem acessar as métricas
  app.get(
    '/dashboard/metrics',
    { preHandler: [requireRole(Role.ADMIN, Role.OPERATOR)] },
    getDashboardMetrics,
  )
}

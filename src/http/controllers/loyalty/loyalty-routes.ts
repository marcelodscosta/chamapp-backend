import { FastifyInstance } from 'fastify'
import {
  getLoyaltyConfig,
  updateLoyaltyConfig,
  createLoyaltyTier,
  getLoyaltyAccount,
} from './loyalty-controller'
import { requireRole } from '../../middleware/auth'
import { Role } from '../../../generated/prisma'
import { getLoyaltyStatement, resetLoyaltyPoints } from './admin-loyalty-controller'

export async function loyaltyRoutes(app: FastifyInstance) {
  // Configurações e Tiers (Apenas ADMIN/OPERATOR editam, clientes podem ver a config)
  app.get('/loyalty/config', getLoyaltyConfig)
  app.put(
    '/loyalty/config',
    { preHandler: [requireRole(Role.ADMIN, Role.OPERATOR)] },
    updateLoyaltyConfig,
  )

  app.post(
    '/loyalty/tiers',
    { preHandler: [requireRole(Role.ADMIN)] },
    createLoyaltyTier,
  )

  // Administração de Contas (ADMIN/OPERATOR)
  app.get(
    '/loyalty/admin/customers/:customerId/statement',
    { preHandler: [requireRole(Role.ADMIN, Role.OPERATOR)] },
    getLoyaltyStatement,
  )
  app.post(
    '/loyalty/admin/customers/:customerId/reset',
    { preHandler: [requireRole(Role.ADMIN, Role.OPERATOR)] },
    resetLoyaltyPoints,
  )

  // Clientes
  app.get(
    '/loyalty/account',
    { preHandler: [requireRole(Role.CUSTOMER)] },
    getLoyaltyAccount,
  )
}

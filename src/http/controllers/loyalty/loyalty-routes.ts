import { FastifyInstance } from 'fastify'
import {
  getLoyaltyConfig,
  updateLoyaltyConfig,
  createLoyaltyTier,
  listLoyaltyTiers,
  listLoyaltyTiers,
  updateLoyaltyTier,
  deleteLoyaltyTier,
  getLoyaltyAccount,
} from './loyalty-controller'
import { requireRole, authMiddleware } from '../../middleware/auth'
import { Role } from '../../../generated/prisma'
import { getLoyaltyStatement, resetLoyaltyPoints } from './admin-loyalty-controller'

export async function loyaltyRoutes(app: FastifyInstance) {
  // Configurações e Tiers (Apenas ADMIN/OPERATOR editam, clientes podem ver a config)
  app.get('/loyalty/config', getLoyaltyConfig)
  app.put(
    '/loyalty/config',
    { preHandler: [authMiddleware, requireRole(Role.ADMIN, Role.OPERATOR)] },
    updateLoyaltyConfig,
  )

  app.get(
    '/loyalty/tiers',
    { preHandler: [authMiddleware, requireRole(Role.ADMIN, Role.OPERATOR)] },
    listLoyaltyTiers,
  )
  
  app.post(
    '/loyalty/tiers',
    { preHandler: [authMiddleware, requireRole(Role.ADMIN)] },
    createLoyaltyTier,
  )

  app.put(
    '/loyalty/tiers/:id',
    { preHandler: [authMiddleware, requireRole(Role.ADMIN)] },
    updateLoyaltyTier,
  )

  app.delete(
    '/loyalty/tiers/:id',
    { preHandler: [authMiddleware, requireRole(Role.ADMIN)] },
    deleteLoyaltyTier,
  )

  // Administração de Contas (ADMIN/OPERATOR)
  app.get(
    '/loyalty/admin/customers/:customerId/statement',
    { preHandler: [authMiddleware, requireRole(Role.ADMIN, Role.OPERATOR)] },
    getLoyaltyStatement,
  )
  app.post(
    '/loyalty/admin/customers/:customerId/reset',
    { preHandler: [authMiddleware, requireRole(Role.ADMIN, Role.OPERATOR)] },
    resetLoyaltyPoints,
  )

  // Clientes
  app.get(
    '/loyalty/account',
    { preHandler: [authMiddleware, requireRole(Role.CUSTOMER)] },
    getLoyaltyAccount,
  )
}

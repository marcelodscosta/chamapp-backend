import { FastifyInstance } from 'fastify'
import { clearTableController } from './clear-table-controller'
import { requireRole } from '../../middleware/auth'
import { Role } from '../../../generated/prisma'

export async function systemRoutes(app: FastifyInstance) {
  // Rotas restritas apenas a Administradores
  app.addHook('preHandler', requireRole(Role.ADMIN))

  app.delete('/system/clear-table/:group', clearTableController)
}

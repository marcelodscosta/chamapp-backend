import { FastifyInstance } from 'fastify'
import { getStoreSettings, updateStoreSettings } from './settings-controller'
import { getStoreAvailability } from './availability-controller'
import { requireRole } from '../../middleware/auth'
import { Role } from '../../../generated/prisma'

export async function settingsRoutes(app: FastifyInstance) {
  // Rota pública para ler configurações (qualquer pessoa logada pode ver se a loja tá aberta)
  app.get('/settings', getStoreSettings)
  app.get('/settings/availability', getStoreAvailability)

  // Apenas admins ou operadores podem atualizar as configurações
  app.put(
    '/settings',
    { preHandler: [requireRole(Role.ADMIN, Role.OPERATOR)] },
    updateStoreSettings,
  )
}

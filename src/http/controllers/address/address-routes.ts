import { FastifyInstance } from 'fastify'
import {
  createAddress,
  listAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from './addresses-controller'
import { requireRole } from '../../middleware/auth'
import { Role } from '../../../generated/prisma'

export async function addressRoutes(app: FastifyInstance) {
  // Apenas clientes gerenciam seus próprios endereços no app (e admins pelo painel, mas o foco aqui é app)
  // O middleware globalAuth já exige login, então só precisamos garantir a role correta (CUSTOMER ou ADMIN)
  app.addHook('preHandler', requireRole(Role.CUSTOMER, Role.ADMIN))

  app.get('/addresses', listAddresses)
  app.post('/addresses', createAddress)
  app.put('/addresses/:id', updateAddress)
  app.delete('/addresses/:id', deleteAddress)
  app.patch('/addresses/:id/default', setDefaultAddress)
}

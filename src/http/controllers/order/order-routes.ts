import { FastifyInstance } from 'fastify'
import {
  createOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
} from './orders-controller'
import { requireRole } from '../../middleware/auth'
import { Role } from '../../../generated/prisma'

export async function orderRoutes(app: FastifyInstance) {
  // O middleware globalAuth já exige login em todas essas rotas.

  // Qualquer pessoa logada pode listar e ver os detalhes dos seus próprios pedidos
  // (O controller restringe para ver apenas o que lhe pertence)
  app.get('/orders', listOrders)
  app.get('/orders/:id', getOrder)

  // Apenas clientes criam pedidos
  app.post('/orders', { preHandler: [requireRole(Role.CUSTOMER)] }, createOrder)

  // Status e outras atualizações (Regras de negócio tratam quem pode fazer o que)
  app.patch('/orders/:id/status', updateOrderStatus)
}

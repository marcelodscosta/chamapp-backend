import { FastifyInstance } from 'fastify'
import {
  createPartner,
  listPartners,
  updatePartner,
  deletePartner,
  createBanner,
  listBanners,
  listActiveBanners,
  updateBanner,
  deleteBanner,
  trackInteraction,
  getPartner,
} from './partners-controller'
import { requireRole } from '../../middleware/auth'
import { Role } from '../../../generated/prisma'

export async function partnerRoutes(app: FastifyInstance) {
  // Rotas públicas/clientes (qualquer usuário logado)
  app.get('/partners/banners/active', listActiveBanners)
  app.get('/partners/:id', getPartner)
  app.post('/partners/banners/:id/interaction', trackInteraction)


  // Rotas de controle administrativo (Admin e Operador)
  app.post('/partners', { preHandler: [requireRole(Role.ADMIN, Role.OPERATOR)] }, createPartner)
  app.get('/partners', { preHandler: [requireRole(Role.ADMIN, Role.OPERATOR)] }, listPartners)
  app.put('/partners/:id', { preHandler: [requireRole(Role.ADMIN, Role.OPERATOR)] }, updatePartner)
  app.delete('/partners/:id', { preHandler: [requireRole(Role.ADMIN)] }, deletePartner)

  app.post('/partners/banners', { preHandler: [requireRole(Role.ADMIN, Role.OPERATOR)] }, createBanner)
  app.get('/partners/banners', { preHandler: [requireRole(Role.ADMIN, Role.OPERATOR)] }, listBanners)
  app.put('/partners/banners/:id', { preHandler: [requireRole(Role.ADMIN, Role.OPERATOR)] }, updateBanner)
  app.delete('/partners/banners/:id', { preHandler: [requireRole(Role.ADMIN)] }, deleteBanner)
}

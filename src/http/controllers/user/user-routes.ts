import { FastifyInstance } from 'fastify'
import { getProfile, updateProfile } from './profile-controller'
import { listUsers, createStaff, toggleStatus } from './users-controller'
import { requireRole } from '../../middleware/auth'
import { Role } from '../../../generated/prisma'

export async function userRoutes(app: FastifyInstance) {
  // ─── Perfil do usuário (qualquer usuário logado) ──────────────────────────
  app.get('/users/me', getProfile)
  app.put('/users/me', updateProfile)
  // app.patch('/users/me/avatar', uploadAvatar) // Fase posterior

  // ─── Gestão de usuários (somente ADMIN) ───────────────────────────────────
  app.get('/users', { preHandler: [requireRole(Role.ADMIN)] }, listUsers)
  app.post('/users', { preHandler: [requireRole(Role.ADMIN)] }, createStaff)
  app.patch(
    '/users/:id/toggle-status',
    { preHandler: [requireRole(Role.ADMIN)] },
    toggleStatus,
  )
}

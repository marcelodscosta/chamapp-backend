import { FastifyInstance } from 'fastify'
import { getProfile, updateProfile } from './profile-controller'
import { listUsers, createStaff, toggleStatus, updateUser } from './users-controller'
import { updateLocationController } from './update-location-controller'
import { getUserLocationsController } from './get-user-locations-controller'
import { requireRole } from '../../middleware/auth'
import { Role } from '../../../generated/prisma'

export async function userRoutes(app: FastifyInstance) {
  // ─── Perfil do usuário (qualquer usuário logado) ──────────────────────────
  app.get('/users/me', getProfile)
  app.put('/users/me', updateProfile)
  // app.patch('/users/me/avatar', uploadAvatar) // Fase posterior

  // ─── Localização em tempo real ────────────────────────────────────────────
  // Mobile envia a posição enquanto o app está aberto
  app.patch('/users/me/location', updateLocationController)
  // Admin consulta todos os usuários online com suas posições
  app.get(
    '/admin/users/locations',
    { preHandler: [requireRole(Role.ADMIN)] },
    getUserLocationsController,
  )

  // ─── Gestão de usuários (somente ADMIN) ───────────────────────────────────
  app.get('/users', { preHandler: [requireRole(Role.ADMIN)] }, listUsers)
  app.post('/users', { preHandler: [requireRole(Role.ADMIN)] }, createStaff)
  app.patch(
    '/users/:id/toggle-status',
    { preHandler: [requireRole(Role.ADMIN)] },
    toggleStatus,
  )
  app.put(
    '/users/:id',
    { preHandler: [requireRole(Role.ADMIN)] },
    updateUser,
  )
}

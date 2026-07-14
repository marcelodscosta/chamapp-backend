import { FastifyInstance } from 'fastify'
import { listTeamController } from './list-team-controller'
import { createTeamMemberController } from './create-team-member-controller'
import { updateTeamMemberController } from './update-team-member-controller'
import { toggleStatusController } from './toggle-status-controller'
import { deleteTeamMemberController } from './delete-team-member-controller'
import { requireRole } from '../../middleware/auth'
import { Role } from '../../../generated/prisma'

export async function teamRoutes(app: FastifyInstance) {
  // Apenas admins podem acessar rotas de equipe
  app.addHook('preHandler', requireRole(Role.ADMIN))

  app.get('/team', listTeamController)
  app.post('/team', createTeamMemberController)
  app.put('/team/:id', updateTeamMemberController)
  app.patch('/team/:id/toggle-status', toggleStatusController)
  app.delete('/team/:id', deleteTeamMemberController)
}

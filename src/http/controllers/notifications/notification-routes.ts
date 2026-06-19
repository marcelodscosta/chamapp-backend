import { FastifyInstance } from 'fastify'
import { registerPushToken, removePushToken } from './notifications-controller'

export async function notificationRoutes(app: FastifyInstance) {
  // Global auth hook exige que o usuário esteja logado

  app.post('/notifications/tokens', registerPushToken)
  app.delete('/notifications/tokens', removePushToken) // Ex: quando faz logout
}

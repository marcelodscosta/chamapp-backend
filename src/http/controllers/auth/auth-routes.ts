import { FastifyInstance } from 'fastify'
import { loginController } from './login-controller'
import { registerController } from './register-controller'
import { googleLoginController } from './google-login-controller'

export async function authRoutes(app: FastifyInstance) {
  // Rotas públicas — sem autenticação
  app.post('/auth/login', loginController)
  app.post('/auth/register', registerController)
  app.post('/auth/google', googleLoginController)
}

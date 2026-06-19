import fastify from 'fastify'
import cors from '@fastify/cors'
import { ZodError } from 'zod'
import { AppError } from './services/errors/app-error'
import { globalAuthMiddleware } from './http/middleware/global-auth'
import { healthRoutes } from './http/controllers/health/health-routes'
import { authRoutes } from './http/controllers/auth/auth-routes'
import { userRoutes } from './http/controllers/user/user-routes'
import { catalogRoutes } from './http/controllers/catalog/catalog-routes'
import { addressRoutes } from './http/controllers/address/address-routes'
import { orderRoutes } from './http/controllers/order/order-routes'

export async function buildApp() {
  const app = fastify({ logger: false })

  // ─── Plugins ───────────────────────────────────────────────────────────────
  await app.register(cors, {
    origin: true, // Em produção, especifique os domínios permitidos
    credentials: true,
  })

  // ─── Global Auth Hook ───────────────────────────────────────────────────────
  app.addHook('onRequest', globalAuthMiddleware)

  // ─── Rotas ─────────────────────────────────────────────────────────────────
  await app.register(healthRoutes)
  await app.register(authRoutes)
  await app.register(userRoutes)
  await app.register(catalogRoutes)
  await app.register(addressRoutes)
  await app.register(orderRoutes)
  // await app.register(productRoutes, { prefix: '/products' })
  // await app.register(categoryRoutes, { prefix: '/categories' })
  // await app.register(addressRoutes, { prefix: '/addresses' })
  // await app.register(orderRoutes, { prefix: '/orders' })
  // await app.register(pushTokenRoutes, { prefix: '/push-tokens' })
  // await app.register(loyaltyRoutes, { prefix: '/loyalty' })
  // await app.register(dashboardRoutes, { prefix: '/dashboard' })
  // await app.register(storeSettingsRoutes, { prefix: '/store-settings' })
  // await app.register(uploadRoutes, { prefix: '/upload' })

  // ─── Error Handler Global ──────────────────────────────────────────────────
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: 'Erro de validação.',
        errors: error.flatten().fieldErrors,
      })
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        message: error.message,
      })
    }

    request.log.error(error)

    return reply.status(500).send({
      message: 'Erro interno no servidor.',
    })
  })

  return app
}

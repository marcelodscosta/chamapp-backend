import fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
import { ZodError } from 'zod'
import { AppError } from './services/errors/app-error'
import { globalAuthMiddleware } from './http/middleware/global-auth'
import { healthRoutes } from './http/controllers/health/health-routes'
import { authRoutes } from './http/controllers/auth/auth-routes'
import { userRoutes } from './http/controllers/user/user-routes'
import { catalogRoutes } from './http/controllers/catalog/catalog-routes'
import { addressRoutes } from './http/controllers/address/address-routes'
import { orderRoutes } from './http/controllers/order/order-routes'
import { notificationRoutes } from './http/controllers/notifications/notification-routes'
import { settingsRoutes } from './http/controllers/store/settings-routes'
import { loyaltyRoutes } from './http/controllers/loyalty/loyalty-routes'
import { dashboardRoutes } from './http/controllers/dashboard/dashboard-routes'

export async function buildApp() {
  const app = fastify({ logger: false })

  // ─── Plugins ───────────────────────────────────────────────────────────────
  await app.register(cors, {
    origin: true, // Em produção, especifique os domínios permitidos
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })

  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
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
  await app.register(notificationRoutes)
  await app.register(settingsRoutes)
  await app.register(loyaltyRoutes)
  await app.register(dashboardRoutes)

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
    console.error('[500 ERROR]', error)
    return reply.status(500).send({
      message: 'Erro interno no servidor.',
    })
  })

  return app
}

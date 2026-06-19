import { FastifyRequest, FastifyReply } from 'fastify'
import { authMiddleware } from './auth'
import { PUBLIC_ROUTES } from './public-routes'

export async function globalAuthMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const isPublic = PUBLIC_ROUTES.some((route) => {
    const methodMatch = route.method === request.method
    const pathMatch =
      route.path instanceof RegExp
        ? route.path.test(request.url.split('?')[0])
        : route.path === request.url.split('?')[0]

    return methodMatch && pathMatch
  })

  if (isPublic) return

  return authMiddleware(request, reply)
}

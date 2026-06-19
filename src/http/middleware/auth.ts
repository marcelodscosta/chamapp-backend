import { FastifyRequest, FastifyReply } from 'fastify'
import { verify } from 'jsonwebtoken'
import { env } from '../../env'
import { Role } from '../../generated/prisma'

interface JwtPayload {
  sub: string
  role: Role
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ message: 'Token não fornecido.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = verify(token, env.JWT_SECRET) as JwtPayload
    request.user = {
      id: decoded.sub,
      role: decoded.role,
    }
  } catch {
    return reply.status(401).send({ message: 'Token inválido ou expirado.' })
  }
}

export function requireRole(...roles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({ message: 'Não autenticado.' })
    }

    if (!roles.includes(request.user.role)) {
      return reply
        .status(403)
        .send({ message: 'Acesso negado: permissão insuficiente.' })
    }
  }
}

// Augment FastifyRequest to include user
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string
      role: Role
    }
  }
}

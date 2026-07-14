import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { hash } from 'bcryptjs'

const createTeamSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'OPERATOR', 'DELIVERY']),
})

export async function createTeamMemberController(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password, phone, role } = createTeamSchema.parse(request.body)

  const emailAlreadyExists = await prisma.user.findUnique({
    where: { email },
  })

  if (emailAlreadyExists) {
    return reply.status(409).send({ message: 'E-mail já está em uso.' })
  }

  const passwordHash = await hash(password, 6)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password_hash: passwordHash,
      phone,
      role,
      is_active: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    }
  })

  return reply.status(201).send({ user })
}

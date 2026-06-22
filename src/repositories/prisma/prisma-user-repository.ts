import { prisma } from '../../lib/prisma'
import {
  IUserRepository,
  CreateUserData,
  UpdateUserData,
} from '../interfaces/IUserRepository'
import { User } from '../../generated/prisma'

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  }

  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({ data })
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    return prisma.user.update({ where: { id }, data })
  }

  async listAll(): Promise<User[]> {
    return prisma.user.findMany({ 
      orderBy: { created_at: 'desc' },
      include: {
        loyaltyAccount: {
          include: { tier: true }
        }
      }
    })
  }

  async toggleStatus(id: string): Promise<User> {
    const user = await prisma.user.findUniqueOrThrow({ where: { id } })
    return prisma.user.update({
      where: { id },
      data: { is_active: !user.is_active },
    })
  }
}

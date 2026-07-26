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

  async findUsersByMarketingFilter(filter: 'ALL' | 'NEVER_BOUGHT' | 'INACTIVE_30_DAYS'): Promise<User[]> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    if (filter === 'NEVER_BOUGHT') {
      return prisma.user.findMany({
        where: {
          role: 'CUSTOMER',
          is_active: true,
          orders: { none: {} },
        },
      })
    }

    if (filter === 'INACTIVE_30_DAYS') {
      return prisma.user.findMany({
        where: {
          role: 'CUSTOMER',
          is_active: true,
          orders: {
            some: {},
            every: { created_at: { lt: thirtyDaysAgo } },
          },
        },
      })
    }

    // Padrão: ALL
    return prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
        is_active: true,
      },
    })
  }

  async deleteAccount(id: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { orders: true },
    })

    if (!user) return

    if (user.orders.length > 0) {
      // Soft Delete (Anonimização)
      await prisma.$transaction([
        prisma.pushToken.deleteMany({ where: { userId: id } }),
        prisma.userLocation.deleteMany({ where: { userId: id } }),
        prisma.user.update({
          where: { id },
          data: {
            name: 'Usuário Excluído',
            email: `deleted_${id}@chamapp.com`,
            phone: null,
            password_hash: '',
            is_active: false,
            avatar_url: null,
          },
        }),
      ])
    } else {
      // Hard Delete
      await prisma.$transaction([
        prisma.pushToken.deleteMany({ where: { userId: id } }),
        prisma.userLocation.deleteMany({ where: { userId: id } }),
        prisma.loyaltyTransaction.deleteMany({
          where: { account: { customerId: id } },
        }),
        prisma.loyaltyAccount.deleteMany({ where: { customerId: id } }),
        prisma.address.deleteMany({ where: { customerId: id } }),
        prisma.user.delete({ where: { id } }),
      ])
    }
  }
}

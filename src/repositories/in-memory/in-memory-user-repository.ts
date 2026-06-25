import {
  IUserRepository,
  CreateUserData,
  UpdateUserData,
} from '../interfaces/IUserRepository'
import { User, Role } from '../../generated/prisma'
import { randomUUID } from 'node:crypto'

export class InMemoryUserRepository implements IUserRepository {
  public items: User[] = []

  async findById(id: string): Promise<User | null> {
    return this.items.find((u) => u.id === id) ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((u) => u.email === email) ?? null
  }

  async create(data: CreateUserData): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      role: data.role ?? Role.CUSTOMER,
      phone: data.phone ?? null,
      avatar_url: null,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    }
    this.items.push(user)
    return user
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const index = this.items.findIndex((u) => u.id === id)
    if (index === -1) throw new Error(`User ${id} not found`)

    this.items[index] = {
      ...this.items[index],
      ...data,
      updated_at: new Date(),
    }
    return this.items[index]
  }

  async listAll(): Promise<User[]> {
    return this.items
  }

  async toggleStatus(id: string): Promise<User> {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      throw new Error('User not found.')
    }

    user.is_active = !user.is_active

    return user
  }

  async findUsersByMarketingFilter(filter: 'ALL' | 'NEVER_BOUGHT' | 'INACTIVE_30_DAYS'): Promise<User[]> {
    return this.items.filter(u => u.role === 'CUSTOMER' && u.is_active)
  }
}

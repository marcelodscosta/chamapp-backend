import { User, Role } from '../../generated/prisma'

export interface CreateUserData {
  name: string
  email: string
  password_hash: string
  role?: Role
  phone?: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  phone?: string
  avatar_url?: string
  password_hash?: string
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: CreateUserData): Promise<User>
  update(id: string, data: UpdateUserData): Promise<User>
  listAll(): Promise<User[]>
  toggleStatus(id: string): Promise<User>
  findUsersByMarketingFilter(filter: 'ALL' | 'NEVER_BOUGHT' | 'INACTIVE_30_DAYS'): Promise<User[]>
}

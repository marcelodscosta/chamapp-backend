import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { ToggleUserStatusUseCase } from '../user/toggle-user-status-use-case'

export function makeToggleUserStatus() {
  const userRepository = new PrismaUserRepository()
  return new ToggleUserStatusUseCase(userRepository)
}

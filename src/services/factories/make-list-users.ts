import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { ListUsersUseCase } from '../user/list-users-use-case'

export function makeListUsers() {
  const userRepository = new PrismaUserRepository()
  return new ListUsersUseCase(userRepository)
}

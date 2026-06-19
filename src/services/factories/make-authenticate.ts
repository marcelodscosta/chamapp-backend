import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { AuthenticateUseCase } from '../auth/authenticate-use-case'

export function makeAuthenticate() {
  const userRepository = new PrismaUserRepository()
  return new AuthenticateUseCase(userRepository)
}

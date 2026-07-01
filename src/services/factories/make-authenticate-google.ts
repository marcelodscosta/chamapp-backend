import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { AuthenticateGoogleUseCase } from '../auth/authenticate-google-use-case'

export function makeAuthenticateGoogle() {
  const userRepository = new PrismaUserRepository()
  const authenticateGoogleUseCase = new AuthenticateGoogleUseCase(userRepository)

  return authenticateGoogleUseCase
}

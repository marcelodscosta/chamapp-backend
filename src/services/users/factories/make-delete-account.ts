import { PrismaUserRepository } from '../../../repositories/prisma/prisma-user-repository'
import { DeleteAccountUseCase } from '../delete-account-use-case'

export function makeDeleteAccountUseCase() {
  const userRepository = new PrismaUserRepository()
  const useCase = new DeleteAccountUseCase(userRepository)

  return useCase
}

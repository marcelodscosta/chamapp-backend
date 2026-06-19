import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { UpdateUserProfileUseCase } from '../user/update-user-profile-use-case'

export function makeUpdateUserProfile() {
  const userRepository = new PrismaUserRepository()
  return new UpdateUserProfileUseCase(userRepository)
}

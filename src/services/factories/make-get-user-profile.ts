import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { GetUserProfileUseCase } from '../user/get-user-profile-use-case'

export function makeGetUserProfile() {
  const userRepository = new PrismaUserRepository()
  return new GetUserProfileUseCase(userRepository)
}

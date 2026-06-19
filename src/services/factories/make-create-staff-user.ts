import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { CreateStaffUserUseCase } from '../user/create-staff-user-use-case'

export function makeCreateStaffUser() {
  const userRepository = new PrismaUserRepository()
  return new CreateStaffUserUseCase(userRepository)
}

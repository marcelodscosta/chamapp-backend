import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { RegisterCustomerUseCase } from '../auth/register-customer-use-case'

export function makeRegisterCustomer() {
  const userRepository = new PrismaUserRepository()
  return new RegisterCustomerUseCase(userRepository)
}

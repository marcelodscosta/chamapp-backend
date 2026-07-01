import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { PrismaOtpRepository } from '../../repositories/prisma/prisma-otp-repository'
import { ResetPasswordUseCase } from '../auth/reset-password-use-case'

export function makeResetPassword() {
  const userRepository = new PrismaUserRepository()
  const otpRepository = new PrismaOtpRepository()
  const useCase = new ResetPasswordUseCase(userRepository, otpRepository)

  return useCase
}

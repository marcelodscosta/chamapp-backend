import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { PrismaOtpRepository } from '../../repositories/prisma/prisma-otp-repository'
import { SendOtpUseCase } from '../auth/send-otp-use-case'

export function makeSendOtp() {
  const userRepository = new PrismaUserRepository()
  const otpRepository = new PrismaOtpRepository()
  const useCase = new SendOtpUseCase(userRepository, otpRepository)

  return useCase
}

import { hash } from 'bcryptjs'
import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { IOtpRepository } from '../../repositories/interfaces/IOtpRepository'
import { AppError } from '../errors/app-error'

interface ResetPasswordRequest {
  email: string
  code: string
  newPassword: string
}

export class ResetPasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private otpRepository: IOtpRepository
  ) {}

  async execute({ email, code, newPassword }: ResetPasswordRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Código inválido ou expirado.', 400)
    }

    const otp = await this.otpRepository.findByEmailAndCode(email, code)

    if (!otp) {
      throw new AppError('Código inválido ou expirado.', 400)
    }

    if (otp.expires_at < new Date()) {
      throw new AppError('Código inválido ou expirado.', 400)
    }

    const passwordHash = await hash(newPassword, 8)
    
    await this.userRepository.update(user.id, {
      password_hash: passwordHash,
    })

    await this.otpRepository.markAsUsed(otp.id)
  }
}

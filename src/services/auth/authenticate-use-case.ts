import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { User } from '../../generated/prisma'
import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { AppError } from '../errors/app-error'
import { env } from '../../env'

interface AuthenticateRequest {
  email: string
  password: string
}

interface AuthenticateResponse {
  token: string
  user: Omit<User, 'password_hash'>
}

export class AuthenticateUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateRequest): Promise<AuthenticateResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    if (!user.is_active) {
      throw new AppError(
        'Usuário desativado. Entre em contato com a loja.',
        403,
      )
    }

    const passwordMatch = await compare(password, user.password_hash)

    if (!passwordMatch) {
      throw new InvalidCredentialsError()
    }

    const token = sign({ role: user.role }, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: '7d',
    })

    const { password_hash: _, ...userWithoutPassword } = user

    return { token, user: userWithoutPassword }
  }
}

import { sign } from 'jsonwebtoken'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { User } from '../../generated/prisma'
import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { AppError } from '../errors/app-error'
import { env } from '../../env'

interface AuthenticateGoogleRequest {
  idToken: string
}

interface AuthenticateGoogleResponse {
  token: string
  user: Omit<User, 'password_hash'>
}

export class AuthenticateGoogleUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    idToken,
  }: AuthenticateGoogleRequest): Promise<AuthenticateGoogleResponse> {
    
    // Validate with Google
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`)
    if (!googleRes.ok) {
      throw new AppError('Token do Google inválido ou expirado.', 401)
    }

    const payload = (await googleRes.json()) as any
    
    if (!payload.email) {
      throw new AppError('Não foi possível obter o e-mail da conta do Google.', 400)
    }

    let user = await this.userRepository.findByEmail(payload.email)

    if (!user) {
      // Create user
      const randomPassword = await hash(randomUUID(), 6)
      user = await this.userRepository.create({
        name: payload.name || 'Usuário Google',
        email: payload.email,
        password_hash: randomPassword,
        avatar_url: payload.picture,
        role: 'CUSTOMER',
      })
    } else {
      if (!user.is_active) {
        throw new AppError('Usuário desativado. Entre em contato com a loja.', 403)
      }
      
      // Optionally update avatar if missing
      if (!user.avatar_url && payload.picture) {
        user = await this.userRepository.update(user.id, { avatar_url: payload.picture })
      }
    }

    const token = sign({ role: user.role }, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: '7d',
    })

    const { password_hash: _, ...userWithoutPassword } = user

    return { token, user: userWithoutPassword }
  }
}

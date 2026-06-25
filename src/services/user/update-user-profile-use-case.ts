import { hash } from 'bcryptjs'
import { User } from '../../generated/prisma'
import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { AppError } from '../errors/app-error'

interface UpdateUserProfileRequest {
  userId: string
  name?: string
  email?: string
  phone?: string
  password?: string
  avatarUrl?: string
}

interface UpdateUserProfileResponse {
  user: Omit<User, 'password_hash'>
}

export class UpdateUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    userId,
    name,
    email,
    phone,
    password,
    avatarUrl,
  }: UpdateUserProfileRequest): Promise<UpdateUserProfileResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404)
    }

    if (email && email !== user.email) {
      const emailExists = await this.userRepository.findByEmail(email)
      if (emailExists) {
        throw new AppError('Este e-mail já está em uso.', 409)
      }
    }

    let passwordHash: string | undefined

    if (password) {
      passwordHash = await hash(password, 10)
    }

    const updatedUser = await this.userRepository.update(userId, {
      name,
      email,
      phone,
      password_hash: passwordHash,
      avatar_url: avatarUrl,
    })

    const { password_hash: _, ...userWithoutPassword } = updatedUser

    return { user: userWithoutPassword }
  }
}

import { User } from '../../generated/prisma'
import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { AppError } from '../errors/app-error'

interface ToggleUserStatusRequest {
  userId: string
}

interface ToggleUserStatusResponse {
  user: Omit<User, 'password_hash'>
}

export class ToggleUserStatusUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    userId,
  }: ToggleUserStatusRequest): Promise<ToggleUserStatusResponse> {
    const userExists = await this.userRepository.findById(userId)

    if (!userExists) {
      throw new AppError('Usuário não encontrado.', 404)
    }

    const user = await this.userRepository.toggleStatus(userId)

    const { password_hash: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword }
  }
}

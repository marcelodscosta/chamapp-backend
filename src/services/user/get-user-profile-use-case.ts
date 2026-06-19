import { User } from '../../generated/prisma'
import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { AppError } from '../errors/app-error'

interface GetUserProfileRequest {
  userId: string
}

interface GetUserProfileResponse {
  user: Omit<User, 'password_hash'>
}

export class GetUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    userId,
  }: GetUserProfileRequest): Promise<GetUserProfileResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404)
    }

    const { password_hash: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword }
  }
}

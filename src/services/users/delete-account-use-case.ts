import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { AppError } from '../errors/app-error'

interface DeleteAccountUseCaseRequest {
  userId: string
}

export class DeleteAccountUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ userId }: DeleteAccountUseCaseRequest): Promise<void> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new AppError('Usuário não encontrado', 404)
    }

    if (!user.is_active) {
      throw new AppError('Conta já está desativada ou excluída')
    }

    await this.userRepository.deleteAccount(userId)
  }
}

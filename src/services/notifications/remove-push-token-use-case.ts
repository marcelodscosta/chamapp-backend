import { IPushTokenRepository } from '../../repositories/interfaces/IPushTokenRepository'

interface RemovePushTokenRequest {
  userId: string
  token: string
}

export class RemovePushTokenUseCase {
  constructor(private pushTokenRepository: IPushTokenRepository) {}

  async execute({ userId, token }: RemovePushTokenRequest): Promise<void> {
    await this.pushTokenRepository.remove(userId, token)
  }
}

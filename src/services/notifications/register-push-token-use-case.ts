import { PushToken, Platform } from '../../generated/prisma'
import { IPushTokenRepository } from '../../repositories/interfaces/IPushTokenRepository'

interface RegisterPushTokenRequest {
  userId: string
  token: string
  platform: Platform
}

interface RegisterPushTokenResponse {
  pushToken: PushToken
}

export class RegisterPushTokenUseCase {
  constructor(private pushTokenRepository: IPushTokenRepository) {}

  async execute({
    userId,
    token,
    platform,
  }: RegisterPushTokenRequest): Promise<RegisterPushTokenResponse> {
    const pushToken = await this.pushTokenRepository.save({
      userId,
      token,
      platform,
    })

    return { pushToken }
  }
}

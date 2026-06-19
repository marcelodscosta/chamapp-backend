import { PrismaPushTokenRepository } from '../../repositories/prisma/prisma-push-token-repository'
import { RegisterPushTokenUseCase } from '../notifications/register-push-token-use-case'
import { RemovePushTokenUseCase } from '../notifications/remove-push-token-use-case'

export function makeRegisterPushToken() {
  const repository = new PrismaPushTokenRepository()
  return new RegisterPushTokenUseCase(repository)
}

export function makeRemovePushToken() {
  const repository = new PrismaPushTokenRepository()
  return new RemovePushTokenUseCase(repository)
}

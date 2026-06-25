import { PrismaUserRepository } from '../../repositories/prisma/prisma-user-repository'
import { PrismaPushTokenRepository } from '../../repositories/prisma/prisma-push-token-repository'
import { ExpoPushNotificationProvider } from '../../providers/PushNotificationProvider/ExpoPushNotificationProvider'
import { SendMarketingPushUseCase } from '../marketing/send-marketing-push-use-case'

export function makeSendMarketingPush() {
  const userRepository = new PrismaUserRepository()
  const pushTokenRepository = new PrismaPushTokenRepository()
  const pushProvider = new ExpoPushNotificationProvider()

  return new SendMarketingPushUseCase(
    userRepository,
    pushTokenRepository,
    pushProvider
  )
}

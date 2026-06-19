import { PrismaOrderRepository } from '../../repositories/prisma/prisma-order-repository'
import { PrismaPushTokenRepository } from '../../repositories/prisma/prisma-push-token-repository'
import { FirebasePushNotificationProvider } from '../../providers/PushNotificationProvider/FirebasePushNotificationProvider'
import { PrismaLoyaltyRepository } from '../../repositories/prisma/prisma-loyalty-repository'
import { UpdateOrderStatusUseCase } from '../order/update-order-status-use-case'

export function makeUpdateOrderStatus() {
  const repository = new PrismaOrderRepository()
  const pushRepo = new PrismaPushTokenRepository()
  const pushProvider = new FirebasePushNotificationProvider()
  const loyaltyRepo = new PrismaLoyaltyRepository()
  return new UpdateOrderStatusUseCase(
    repository,
    pushRepo,
    pushProvider,
    loyaltyRepo,
  )
}

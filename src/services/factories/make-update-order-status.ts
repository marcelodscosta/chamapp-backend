import { PrismaOrderRepository } from '../../repositories/prisma/prisma-order-repository'
import { PrismaPushTokenRepository } from '../../repositories/prisma/prisma-push-token-repository'
import { FirebasePushNotificationProvider } from '../../providers/PushNotificationProvider/FirebasePushNotificationProvider'
import { UpdateOrderStatusUseCase } from '../order/update-order-status-use-case'

export function makeUpdateOrderStatus() {
  const repository = new PrismaOrderRepository()
  const pushRepo = new PrismaPushTokenRepository()
  const pushProvider = new FirebasePushNotificationProvider()
  return new UpdateOrderStatusUseCase(repository, pushRepo, pushProvider)
}

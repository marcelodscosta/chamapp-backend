import { prisma } from '../../lib/prisma'
import {
  IPushTokenRepository,
  SavePushTokenData,
} from '../interfaces/IPushTokenRepository'
import { PushToken } from '../../generated/prisma'

export class PrismaPushTokenRepository implements IPushTokenRepository {
  async save(data: SavePushTokenData): Promise<PushToken> {
    // Upsert para garantir que não duplica o token e mantém ele ativo
    return prisma.pushToken.upsert({
      where: { token: data.token },
      update: {
        userId: data.userId,
        platform: data.platform,
        is_active: true,
      },
      create: {
        userId: data.userId,
        token: data.token,
        platform: data.platform,
        is_active: true,
      },
    })
  }

  async remove(userId: string, token: string): Promise<void> {
    await prisma.pushToken.deleteMany({
      where: {
        userId,
        token,
      },
    })
  }

  async findByUserId(userId: string): Promise<PushToken[]> {
    return prisma.pushToken.findMany({
      where: {
        userId,
        is_active: true,
      },
    })
  }
}

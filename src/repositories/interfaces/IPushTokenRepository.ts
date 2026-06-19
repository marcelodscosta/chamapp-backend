import { PushToken, Platform } from '../../generated/prisma'

export interface SavePushTokenData {
  userId: string
  token: string
  platform: Platform
}

export interface IPushTokenRepository {
  save(data: SavePushTokenData): Promise<PushToken>
  remove(userId: string, token: string): Promise<void>
  findByUserId(userId: string): Promise<PushToken[]>
}

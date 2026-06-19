import {
  IPushTokenRepository,
  SavePushTokenData,
} from '../interfaces/IPushTokenRepository'
import { PushToken } from '../../generated/prisma'
import { randomUUID } from 'node:crypto'

export class InMemoryPushTokenRepository implements IPushTokenRepository {
  public items: PushToken[] = []

  async save(data: SavePushTokenData): Promise<PushToken> {
    const existingIndex = this.items.findIndex((t) => t.token === data.token)

    if (existingIndex >= 0) {
      this.items[existingIndex].userId = data.userId
      this.items[existingIndex].platform = data.platform
      this.items[existingIndex].is_active = true
      this.items[existingIndex].updated_at = new Date()
      return this.items[existingIndex]
    }

    const token: PushToken = {
      id: randomUUID(),
      userId: data.userId,
      token: data.token,
      platform: data.platform,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(token)
    return token
  }

  async remove(userId: string, token: string): Promise<void> {
    this.items = this.items.filter(
      (t) => !(t.userId === userId && t.token === token),
    )
  }

  async findByUserId(userId: string): Promise<PushToken[]> {
    return this.items.filter((t) => t.userId === userId && t.is_active)
  }
}

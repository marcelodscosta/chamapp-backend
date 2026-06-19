import { describe, it, expect, beforeEach } from 'vitest'
import { RegisterPushTokenUseCase } from './register-push-token-use-case'
import { InMemoryPushTokenRepository } from '../../repositories/in-memory/in-memory-push-token-repository'
import { Platform } from '../../generated/prisma'

let pushTokenRepository: InMemoryPushTokenRepository
let sut: RegisterPushTokenUseCase

describe('RegisterPushTokenUseCase', () => {
  beforeEach(() => {
    pushTokenRepository = new InMemoryPushTokenRepository()
    sut = new RegisterPushTokenUseCase(pushTokenRepository)
  })

  it('deve registrar um novo token de push', async () => {
    const { pushToken } = await sut.execute({
      userId: 'user-1',
      token: 'token-123',
      platform: Platform.ANDROID,
    })

    expect(pushToken.id).toBeDefined()
    expect(pushToken.token).toBe('token-123')
  })

  it('deve atualizar um token existente em vez de duplicar', async () => {
    await sut.execute({
      userId: 'user-1',
      token: 'token-123',
      platform: Platform.ANDROID,
    })

    const { pushToken } = await sut.execute({
      userId: 'user-2', // Alguém logou no mesmo aparelho
      token: 'token-123',
      platform: Platform.ANDROID,
    })

    const tokens = pushTokenRepository.items
    expect(tokens).toHaveLength(1)
    expect(tokens[0].userId).toBe('user-2')
    expect(pushToken.userId).toBe('user-2')
  })
})

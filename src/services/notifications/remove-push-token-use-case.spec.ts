import { describe, it, expect, beforeEach } from 'vitest'
import { RemovePushTokenUseCase } from './remove-push-token-use-case'
import { InMemoryPushTokenRepository } from '../../repositories/in-memory/in-memory-push-token-repository'

let pushTokenRepository: InMemoryPushTokenRepository
let sut: RemovePushTokenUseCase

describe('RemovePushTokenUseCase', () => {
  beforeEach(() => {
    pushTokenRepository = new InMemoryPushTokenRepository()
    sut = new RemovePushTokenUseCase(pushTokenRepository)
  })

  it('deve remover um token de push', async () => {
    await pushTokenRepository.save({
      userId: 'user-1',
      token: 'token-123',
      platform: 'ANDROID',
    })

    await sut.execute({
      userId: 'user-1',
      token: 'token-123',
    })

    const tokens = pushTokenRepository.items
    expect(tokens).toHaveLength(0)
  })
})

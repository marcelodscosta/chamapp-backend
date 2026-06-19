import { describe, it, expect, beforeEach } from 'vitest'
import { GetLoyaltyConfigUseCase } from './get-loyalty-config-use-case'
import { InMemoryLoyaltyRepository } from '../../repositories/in-memory/in-memory-loyalty-repository'

let loyaltyRepository: InMemoryLoyaltyRepository
let sut: GetLoyaltyConfigUseCase

describe('GetLoyaltyConfigUseCase', () => {
  beforeEach(() => {
    loyaltyRepository = new InMemoryLoyaltyRepository()
    sut = new GetLoyaltyConfigUseCase(loyaltyRepository)
  })

  it('deve retornar null se a config não existir', async () => {
    const { config } = await sut.execute()
    expect(config).toBeNull()
  })

  it('deve retornar a configuração existente', async () => {
    await loyaltyRepository.upsertConfig({ program_enabled: true })
    const { config } = await sut.execute()
    expect(config?.program_enabled).toBe(true)
  })
})

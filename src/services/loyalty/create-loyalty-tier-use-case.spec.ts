import { describe, it, expect, beforeEach } from 'vitest'
import { CreateLoyaltyTierUseCase } from './create-loyalty-tier-use-case'
import { InMemoryLoyaltyRepository } from '../../repositories/in-memory/in-memory-loyalty-repository'

let loyaltyRepository: InMemoryLoyaltyRepository
let sut: CreateLoyaltyTierUseCase

describe('CreateLoyaltyTierUseCase', () => {
  beforeEach(() => {
    loyaltyRepository = new InMemoryLoyaltyRepository()
    sut = new CreateLoyaltyTierUseCase(loyaltyRepository)
  })

  it('deve criar um nível (tier) de fidelidade', async () => {
    const { tier } = await sut.execute({
      name: 'Bronze',
      min_spent: 0,
      period_days: 30,
      multiplier: 1,
    })

    expect(tier.id).toBeDefined()
    expect(tier.name).toBe('Bronze')
  })
})

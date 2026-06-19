import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateLoyaltyConfigUseCase } from './update-loyalty-config-use-case'
import { InMemoryLoyaltyRepository } from '../../repositories/in-memory/in-memory-loyalty-repository'

let loyaltyRepository: InMemoryLoyaltyRepository
let sut: UpdateLoyaltyConfigUseCase

describe('UpdateLoyaltyConfigUseCase', () => {
  beforeEach(() => {
    loyaltyRepository = new InMemoryLoyaltyRepository()
    sut = new UpdateLoyaltyConfigUseCase(loyaltyRepository)
  })

  it('deve criar e atualizar a configuração de fidelidade', async () => {
    const { config: created } = await sut.execute({
      program_enabled: true,
      points_per_real: 5,
    })
    expect(created.program_enabled).toBe(true)
    expect(Number(created.points_per_real)).toBe(5)

    const { config: updated } = await sut.execute({ program_enabled: false })
    expect(updated.program_enabled).toBe(false)
    expect(Number(updated.points_per_real)).toBe(5) // manteve o anterior
  })
})

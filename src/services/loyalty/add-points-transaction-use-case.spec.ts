import { describe, it, expect, beforeEach } from 'vitest'
import { AddPointsTransactionUseCase } from './add-points-transaction-use-case'
import { InMemoryLoyaltyRepository } from '../../repositories/in-memory/in-memory-loyalty-repository'
import { AppError } from '../errors/app-error'

let loyaltyRepository: InMemoryLoyaltyRepository
let sut: AddPointsTransactionUseCase

describe('AddPointsTransactionUseCase', () => {
  beforeEach(() => {
    loyaltyRepository = new InMemoryLoyaltyRepository()
    sut = new AddPointsTransactionUseCase(loyaltyRepository)
  })

  it('não deve permitir adicionar pontos se o programa estiver desativado', async () => {
    await loyaltyRepository.upsertConfig({ program_enabled: false })
    await expect(
      sut.execute({ customerId: 'user-1', points: 10, description: 'Teste' }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('deve criar a conta e adicionar pontos se não existir', async () => {
    await loyaltyRepository.upsertConfig({
      program_enabled: true,
      program_mode: 'POINTS',
    })
    await loyaltyRepository.createTier({ name: 'Bronze', min_points: 0 })

    const { account } = await sut.execute({
      customerId: 'user-1',
      points: 50,
      description: 'Compra #1',
    })

    expect(account.balance_points).toBe(50)
    expect(account.total_earned).toBe(50)

    const transactions = await loyaltyRepository.listTransactionsByAccount(
      account.id,
    )
    expect(transactions).toHaveLength(1)
  })
})

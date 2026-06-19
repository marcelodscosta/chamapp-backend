import { describe, it, expect, beforeEach } from 'vitest'
import { GetLoyaltyAccountUseCase } from './get-loyalty-account-use-case'
import { InMemoryLoyaltyRepository } from '../../repositories/in-memory/in-memory-loyalty-repository'

let loyaltyRepository: InMemoryLoyaltyRepository
let sut: GetLoyaltyAccountUseCase

describe('GetLoyaltyAccountUseCase', () => {
  beforeEach(() => {
    loyaltyRepository = new InMemoryLoyaltyRepository()
    sut = new GetLoyaltyAccountUseCase(loyaltyRepository)
  })

  it('deve retornar null se o cliente não tiver conta', async () => {
    const { account, transactions } = await sut.execute('user-1')
    expect(account).toBeNull()
    expect(transactions).toHaveLength(0)
  })

  it('deve retornar a conta e transações', async () => {
    const tier = await loyaltyRepository.createTier({
      name: 'Bronze',
      min_points: 0,
    })
    const acc = await loyaltyRepository.createAccount({
      customerId: 'user-1',
      tierId: tier.id,
    })
    await loyaltyRepository.createTransaction(
      { accountId: acc.id, type: 'EARNED', points: 10, description: 'Compra' },
      10,
    )

    const { account, transactions } = await sut.execute('user-1')
    expect(account?.id).toBe(acc.id)
    expect(transactions).toHaveLength(1)
  })
})

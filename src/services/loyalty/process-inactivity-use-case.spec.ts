import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryLoyaltyRepository } from '../../repositories/in-memory/in-memory-loyalty-repository'
import { ProcessInactivityUseCase } from './process-inactivity-use-case'
import { Decimal } from '../../generated/prisma/runtime/library'

let loyaltyRepository: InMemoryLoyaltyRepository
let sut: ProcessInactivityUseCase
let tierBronzeId: string
let tierOuroId: string

describe('ProcessInactivityUseCase', () => {
  beforeEach(async () => {
    loyaltyRepository = new InMemoryLoyaltyRepository()
    sut = new ProcessInactivityUseCase(loyaltyRepository)

    await loyaltyRepository.upsertConfig({ inactivity_days: 90 })

    const tierBronze = await loyaltyRepository.createTier({
      name: 'Bronze',
      min_spent: 0,
      period_days: 30,
      order: 1,
    })
    tierBronzeId = tierBronze.id

    const tierOuro = await loyaltyRepository.createTier({
      name: 'Prata',
      min_spent: 1000,
      period_days: 30,
      order: 2,
    })
    tierOuroId = tierOuro.id

    // Cliente inativo (100 dias atrás)
    const inactiveDate = new Date()
    inactiveDate.setDate(inactiveDate.getDate() - 100)

    const inactiveAccount = await loyaltyRepository.createAccount({
      customerId: 'cust-inactive',
      tierId: tierOuro.id,
    })
    
    await loyaltyRepository.updateAccountBalance(inactiveAccount.id, 500, 0, true)
    
    // Forçar inatividade
    const account1 = loyaltyRepository.accounts.find(a => a.id === inactiveAccount.id)!
    account1.last_activity_at = inactiveDate

    // Cliente ativo (10 dias atrás)
    const activeDate = new Date()
    activeDate.setDate(activeDate.getDate() - 10)

    const activeAccount = await loyaltyRepository.createAccount({
      customerId: 'cust-active',
      tierId: tierOuro.id,
    })
    
    await loyaltyRepository.updateAccountBalance(activeAccount.id, 800, 0, true)

    // Forçar data recente
    const account2 = loyaltyRepository.accounts.find(a => a.id === activeAccount.id)!
    account2.last_activity_at = activeDate
  })

  it('deve zerar os pontos e rebaixar de tier apenas de clientes inativos', async () => {
    const { processed } = await sut.execute()
    expect(processed).toBe(1)

    const inactiveAccount = await loyaltyRepository.getAccountByCustomerId('cust-inactive')
    expect(inactiveAccount?.balance_points).toBe(0)
    expect(inactiveAccount?.tierId).toBe(tierBronzeId)

    const activeAccount = await loyaltyRepository.getAccountByCustomerId('cust-active')
    expect(activeAccount?.balance_points).toBe(800)
    expect(activeAccount?.tierId).toBe(tierOuroId)
  })
})

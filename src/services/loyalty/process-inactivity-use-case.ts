import { ILoyaltyRepository } from '../../repositories/interfaces/ILoyaltyRepository'

export class ProcessInactivityUseCase {
  constructor(private loyaltyRepository: ILoyaltyRepository) {}

  async execute() {
    const config = await this.loyaltyRepository.getConfig()
    
    // Se o programa estiver desativado ou não houver config, ignorar
    if (!config || !config.program_enabled) {
      return { processed: 0 }
    }

    // Calcula a data limite de inatividade (ex: 90 dias atrás)
    const thresholdDate = new Date()
    thresholdDate.setDate(thresholdDate.getDate() - config.inactivity_days)

    // Busca clientes inativos (que ainda tem pontos/cashback para zerar ou precisam ser rebaixados)
    const inactiveAccounts = await this.loyaltyRepository.listInactiveAccounts(thresholdDate)

    if (inactiveAccounts.length === 0) {
      return { processed: 0 }
    }

    // Buscar o Tier Básico (para rebaixar o cliente)
    const tiers = await this.loyaltyRepository.listTiers()
    const baseTier = tiers[0] // O Tier com ordem menor (Bronze)
    
    let processedCount = 0

    for (const account of inactiveAccounts) {
      // 1. Zera a conta e rebaixa de categoria
      await this.loyaltyRepository.resetAccountInactivity(account.id, baseTier.id)

      // 2. Grava a transação de perda de pontos por expiração
      if (account.balance_points > 0 || Number(account.balance_cashback) > 0) {

        await this.loyaltyRepository.createTransaction(
          {
            accountId: account.id,
            type: 'EXPIRED',
            points: -account.balance_points, // pontos removidos
            cashback_amount: -account.balance_cashback, // cashback removido
            description: `Pontos expirados por inatividade (${config.inactivity_days} dias)`,
          },
          0 // balanceAfter é 0
        )
      }
      
      processedCount++
    }

    return { processed: processedCount }
  }
}

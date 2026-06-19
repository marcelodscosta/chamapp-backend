import { LoyaltyAccount } from '../../generated/prisma'
import { ILoyaltyRepository } from '../../repositories/interfaces/ILoyaltyRepository'
import { AppError } from '../errors/app-error'

interface AddPointsRequest {
  customerId: string
  orderId?: string
  points: number
  description: string
}

export class AddPointsTransactionUseCase {
  constructor(private loyaltyRepository: ILoyaltyRepository) {}

  async execute({
    customerId,
    orderId,
    points,
    description,
  }: AddPointsRequest): Promise<{ account: LoyaltyAccount }> {
    const config = await this.loyaltyRepository.getConfig()

    if (!config || !config.program_enabled) {
      throw new AppError('Programa de fidelidade não está ativo.', 400)
    }

    let account =
      await this.loyaltyRepository.getAccountByCustomerId(customerId)

    // Se o cliente não tem conta ainda, criamos uma e vinculamos ao menor Tier
    if (!account) {
      const tiers = await this.loyaltyRepository.listTiers()
      if (tiers.length === 0) {
        throw new AppError(
          'Nenhum nível (Tier) de fidelidade configurado.',
          500,
        )
      }

      const lowestTier = tiers[0]
      account = await this.loyaltyRepository.createAccount({
        customerId,
        tierId: lowestTier.id,
      })
    }

    // Calcula cashback se o modo for CASHBACK
    let cashbackAmount = 0
    if (config.program_mode === 'CASHBACK') {
      cashbackAmount = points * Number(config.conversion_rate)
    }

    // Adiciona o saldo
    account = await this.loyaltyRepository.updateAccountBalance(
      account.id,
      points,
      cashbackAmount,
      true,
    )

    // Salva a transação
    await this.loyaltyRepository.createTransaction(
      {
        accountId: account.id,
        orderId,
        type: 'EARNED',
        points,
        cashback_amount: cashbackAmount,
        description,
      },
      account.balance_points,
    )

    // Verifica se houve upgrade de Tier
    const newTier = await this.loyaltyRepository.findTierByPoints(
      account.total_earned,
    )

    if (newTier && newTier.id !== account.tierId) {
      // Futuro: Lógica para dar upgrade real (Update na conta com novo Tier)
      // Por simplicidade do MVP, poderíamos atualizar o tierId do LoyaltyAccount aqui.
    }

    return { account }
  }
}

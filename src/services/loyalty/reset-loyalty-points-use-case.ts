import { prisma } from '../../lib/prisma'
import { LoyaltyTransactionType } from '../../generated/prisma'

interface ResetLoyaltyPointsUseCaseRequest {
  customerId: string
  adminId: string
}

export class ResetLoyaltyPointsUseCase {
  async execute({ customerId, adminId }: ResetLoyaltyPointsUseCaseRequest) {
    const account = await prisma.loyaltyAccount.findUnique({
      where: { customerId },
    })

    if (!account) {
      throw new Error('Conta de fidelidade não encontrada.')
    }

    if (account.balance_points === 0 && account.balance_cashback.toNumber() === 0) {
      throw new Error('O saldo já está zerado.')
    }

    // Usar uma transaction do Prisma para garantir a consistência
    const [transaction, updatedAccount] = await prisma.$transaction([
      prisma.loyaltyTransaction.create({
        data: {
          accountId: account.id,
          type: LoyaltyTransactionType.ADJUSTED,
          points: -account.balance_points, // Remove todos os pontos
          cashback_amount: account.balance_cashback.toNumber() * -1,
          balance_after: 0,
          description: 'Saldo zerado pelo administrador',
          performed_by: adminId,
        },
      }),
      prisma.loyaltyAccount.update({
        where: { id: account.id },
        data: {
          balance_points: 0,
          balance_cashback: 0,
          updated_at: new Date(),
        },
      }),
    ])

    return { transaction, account: updatedAccount }
  }
}

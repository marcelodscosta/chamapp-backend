import { prisma } from '../../lib/prisma'
import { LoyaltyTier } from '../../generated/prisma'

interface CalculateUserTierRequest {
  customerId: string
}

export class CalculateUserTierUseCase {
  async execute({ customerId }: CalculateUserTierRequest): Promise<{ tier: LoyaltyTier }> {
    const tiers = await prisma.loyaltyTier.findMany({
      orderBy: { min_spent: 'desc' },
    })

    if (tiers.length === 0) {
      throw new Error('Nenhum nível configurado.')
    }

    const now = new Date()

    // O fallback será o menor tier (último da lista)
    let bestTier: LoyaltyTier = tiers[tiers.length - 1]

    for (const tier of tiers) {
      // Data de corte para o período do tier
      const periodStart = new Date(now.getTime() - tier.period_days * 24 * 60 * 60 * 1000)

      // Agregar o total gasto pelo cliente neste período
      const aggregations = await prisma.order.aggregate({
        _sum: {
          total_value: true,
        },
        where: {
          customerId,
          status: 'DELIVERED',
          created_at: {
            gte: periodStart,
          },
        },
      })

      const totalSpent = Number(aggregations._sum.total_value || 0)

      if (totalSpent >= Number(tier.min_spent)) {
        bestTier = tier
        break
      }
    }

    return { tier: bestTier }
  }
}

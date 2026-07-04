import { prisma } from '../../lib/prisma'
import { CalculateUserTierUseCase } from './calculate-user-tier-use-case'
import { ILoyaltyRepository } from '../../repositories/interfaces/ILoyaltyRepository'
import { firebaseAdmin } from '../../lib/firebase'
export class EvaluateCustomerTiersUseCase {
  constructor(private loyaltyRepository: ILoyaltyRepository) {}

  async execute() {
    const config = await this.loyaltyRepository.getConfig()
    if (!config || !config.program_enabled) {
      return { processed: 0, downgraded: 0 }
    }

    const accounts = await prisma.loyaltyAccount.findMany({
      include: { tier: true, customer: true },
    })

    const calculateTier = new CalculateUserTierUseCase()

    let downgradedCount = 0

    for (const account of accounts) {
      const { tier: newTier } = await calculateTier.execute({ customerId: account.customerId })

      // Se o novo tier for diferente e a meta de gastos for menor (downgrade)
      // Comparamos min_spent para saber se foi rebaixado
      if (newTier.id !== account.tierId && newTier.min_spent < account.tier.min_spent) {
        // Rebaixar cliente
        await this.loyaltyRepository.resetAccountInactivity(account.id, newTier.id)
        
        // Enviar notificação Push para os tokens do cliente
        const pushTokens = await prisma.pushToken.findMany({
          where: { userId: account.customerId }
        })

        if (pushTokens.length > 0 && firebaseAdmin.apps.length > 0) {
          const tokens = pushTokens.map(pt => pt.token)
          try {
            await firebaseAdmin.messaging().sendEachForMulticast({
              tokens,
              notification: {
                title: 'Atualização do seu Nível ⚠️',
                body: `Você não atingiu a meta de compras e seu nível passou para ${newTier.name}. Faça novos pedidos para recuperar seus benefícios!`
              },
              data: { type: 'TIER_DOWNGRADE' }
            })
          } catch (error) {
            console.error('Erro ao enviar push de rebaixamento:', error)
          }
        }

        downgradedCount++
      }
    }

    return { processed: accounts.length, downgraded: downgradedCount }
  }
}

import cron from 'node-cron'
import { PrismaLoyaltyRepository } from '../repositories/prisma/prisma-loyalty-repository'
import { ProcessInactivityUseCase } from '../services/loyalty/process-inactivity-use-case'
import { EvaluateCustomerTiersUseCase } from '../services/loyalty/evaluate-customer-tiers-use-case'

export function startLoyaltyCron() {
  // Roda todo dia às 02:00 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('[CRON] Iniciando rotinas noturnas de fidelidade...')
    try {
      const loyaltyRepo = new PrismaLoyaltyRepository()
      
      // 1. Zera pontos de quem expirou
      const processInactivity = new ProcessInactivityUseCase(loyaltyRepo)
      const { processed } = await processInactivity.execute()
      console.log(`[CRON] Inatividade: ${processed} clientes zerados.`)

      // 2. Avalia Tiers (downgrades) por falta de compras no período
      const evaluateTiers = new EvaluateCustomerTiersUseCase(loyaltyRepo)
      const { downgraded } = await evaluateTiers.execute()
      console.log(`[CRON] Tiers: ${downgraded} clientes rebaixados.`)
      
    } catch (error) {
      console.error('[CRON] Erro ao processar rotinas de fidelidade:', error)
    }
  })
  
  console.log('🤖 Cron Job de Fidelidade inicializado (Roda diariamente às 02h00)')
}

import cron from 'node-cron'
import { PrismaLoyaltyRepository } from '../repositories/prisma/prisma-loyalty-repository'
import { ProcessInactivityUseCase } from '../services/loyalty/process-inactivity-use-case'

export function startLoyaltyCron() {
  // Roda todos os dias às 02:00 da manhã
  cron.schedule('0 2 * * *', async () => {
    console.log('[CRON] Iniciando verificação de inatividade de fidelidade...')
    try {
      const loyaltyRepository = new PrismaLoyaltyRepository()
      const useCase = new ProcessInactivityUseCase(loyaltyRepository)
      
      const { processed } = await useCase.execute()
      
      console.log(`[CRON] Verificação finalizada com sucesso. ${processed} clientes perderam fidelidade por inatividade.`)
    } catch (error) {
      console.error('[CRON] Erro ao processar inatividade:', error)
    }
  })
  
  console.log('🤖 Cron Job de Fidelidade inicializado (Roda diariamente às 02h00)')
}

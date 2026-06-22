import { env } from './env'
import { buildApp } from './app'
import { logger } from './lib/logger'
import { Server } from 'socket.io'
import { appEvents } from './lib/events'
import { startLoyaltyCron } from './jobs/loyalty-cron'

async function main() {
  const app = await buildApp()

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' })
    
    startLoyaltyCron()

    const io = new Server(app.server, {
      cors: {
        origin: true,
        credentials: true,
      }
    })

    appEvents.on('order:created', (order) => {
      io.emit('order:created', order)
    })

    io.on('connection', (socket) => {
      logger.info(`🔌 Novo painel conectado via WebSocket: ${socket.id}`)
    })

    logger.info(`🚀 ChamApp Backend rodando na porta ${env.PORT}`)
    logger.info(`   Ambiente: ${env.NODE_ENV}`)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

main()

import { env } from './env'
import { buildApp } from './app'
import { logger } from './lib/logger'

async function main() {
  const app = await buildApp()

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' })
    logger.info(`🚀 ChamApp Backend rodando na porta ${env.PORT}`)
    logger.info(`   Ambiente: ${env.NODE_ENV}`)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

main()

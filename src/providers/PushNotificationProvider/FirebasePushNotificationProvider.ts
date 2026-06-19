import { firebaseAdmin } from '../../lib/firebase'
import {
  IPushNotificationProvider,
  SendPushMessage,
} from './IPushNotificationProvider'

export class FirebasePushNotificationProvider implements IPushNotificationProvider {
  async send(message: SendPushMessage): Promise<void> {
    if (message.tokens.length === 0) return

    // Se o Firebase não estiver inicializado (ex: ambiente dev local sem chaves), apenas loga
    if (!firebaseAdmin.apps.length) {
      console.log('[Push Mock] Mensagem:', message)
      return
    }

    const payload = {
      notification: {
        title: message.title,
        body: message.body,
      },
      data: message.data,
      tokens: message.tokens,
    }

    try {
      const response = await firebaseAdmin
        .messaging()
        .sendEachForMulticast(payload)
      if (response.failureCount > 0) {
        const failedTokens: string[] = []
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(message.tokens[idx])
            console.error(
              `Falha ao enviar push para token ${message.tokens[idx]}:`,
              resp.error,
            )
          }
        })
        // Aqui poderíamos desativar os tokens falhos no banco de dados (remover is_active).
      }
    } catch (error) {
      console.error('Erro fatal ao enviar Push Notifications:', error)
    }
  }
}

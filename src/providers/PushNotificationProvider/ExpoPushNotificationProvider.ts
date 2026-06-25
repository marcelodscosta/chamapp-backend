import {
  IPushNotificationProvider,
  SendPushMessage,
} from './IPushNotificationProvider'

export class ExpoPushNotificationProvider implements IPushNotificationProvider {
  async send(message: SendPushMessage): Promise<void> {
    if (message.tokens.length === 0) return

    const messages = message.tokens.map((token) => ({
      to: token,
      sound: 'default',
      title: message.title,
      body: message.body,
      data: message.data,
    }))

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.error('Falha na API do Expo Push:', data)
      } else {
        // Expo retorna um array de "tickets" para cada mensagem
        // Aqui podemos checar se algum deu erro 'DeviceNotRegistered' e tratar depois
        console.log(`[Expo Push] Enviado ${messages.length} notificações.`)
      }
    } catch (error) {
      console.error('Erro fatal ao enviar Expo Push Notifications:', error)
    }
  }
}

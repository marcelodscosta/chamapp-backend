export interface SendPushMessage {
  tokens: string[]
  title: string
  body: string
  data?: Record<string, string>
}

export interface IPushNotificationProvider {
  send(message: SendPushMessage): Promise<void>
}

import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { IPushTokenRepository } from '../../repositories/interfaces/IPushTokenRepository'
import { IPushNotificationProvider } from '../../providers/PushNotificationProvider/IPushNotificationProvider'
import { prisma } from '../../lib/prisma'

interface SendMarketingPushRequest {
  adminId: string
  title: string
  body: string
  imageUrl?: string
  filter: 'ALL' | 'NEVER_BOUGHT' | 'INACTIVE_30_DAYS'
}

interface SendMarketingPushResponse {
  usersTargeted: number
  tokensSent: number
}

export class SendMarketingPushUseCase {
  constructor(
    private userRepository: IUserRepository,
    private pushTokenRepository: IPushTokenRepository,
    private pushNotificationProvider: IPushNotificationProvider
  ) {}

  async execute({
    adminId,
    title,
    body,
    imageUrl,
    filter,
  }: SendMarketingPushRequest): Promise<SendMarketingPushResponse> {
    // 1. Validar se o usuário é admin
    const admin = await this.userRepository.findById(adminId)
    if (!admin || admin.role !== 'ADMIN') {
      console.error('SendMarketingPushUseCase Failed - adminId:', adminId, 'admin:', admin)
      throw new Error('Not authorized.')
    }

    // 2. Buscar usuários que se encaixam no filtro
    const targetUsers = await this.userRepository.findUsersByMarketingFilter(filter)
    if (targetUsers.length === 0) {
      return { usersTargeted: 0, tokensSent: 0 }
    }

    const userIds = targetUsers.map((u) => u.id)

    // 3. Buscar tokens ativos desses usuários
    // Como a interface IPushTokenRepository pode não ter um findByUserIds nativo (array), 
    // faremos uma busca direta no Prisma ou iteraremos. Vamos adicionar buscar diretamente aqui para agilidade do marketing
    const tokens = await prisma.pushToken.findMany({
      where: {
        userId: { in: userIds },
        is_active: true,
      },
    })

    if (tokens.length === 0) {
      return { usersTargeted: targetUsers.length, tokensSent: 0 }
    }

    const tokenStrings = tokens.map((t) => t.token)

    // 4. Preparar payload
    const data: any = { type: 'MARKETING' }
    if (imageUrl) {
      data.imageUrl = imageUrl // Adiciona no data payload para apps processarem
    }

    // 5. Enviar Notificações via Provider
    await this.pushNotificationProvider.send({
      title,
      body,
      tokens: tokenStrings,
      data,
    })

    // 6. Registrar log de notificação no banco de dados (1 por disparo de marketing geral)
    await prisma.notificationLog.create({
      data: {
        title,
        body,
        type: 'MARKETING',
        status: 'SENT',
        userId: adminId, // Quem disparou
        error: `Targeted: ${targetUsers.length} | Sent to: ${tokens.length} tokens. Filter: ${filter}`,
      },
    })

    return {
      usersTargeted: targetUsers.length,
      tokensSent: tokens.length,
    }
  }
}

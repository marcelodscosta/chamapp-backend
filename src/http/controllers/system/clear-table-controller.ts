import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

const clearTableParamsSchema = z.object({
  group: z.enum(['orders', 'customers', 'catalog', 'partners', 'notifications', 'all']),
})

export async function clearTableController(request: FastifyRequest, reply: FastifyReply) {
  const { group } = clearTableParamsSchema.parse(request.params)

  try {
    if (group === 'orders' || group === 'all') {
      // Exclui pedidos e dependências diretas
      await prisma.$transaction([
        prisma.loyaltyTransaction.deleteMany({ where: { orderId: { not: null } } }),
        prisma.orderItem.deleteMany(),
        prisma.order.deleteMany(),
      ])
    }

    if (group === 'catalog' || group === 'all') {
      // Exclui produtos e categorias (precisa excluir itens de pedido também por causa das FKs)
      await prisma.$transaction([
        prisma.orderItem.deleteMany(),
        prisma.product.deleteMany(),
        prisma.productCategory.deleteMany(),
      ])
    }

    if (group === 'partners' || group === 'all') {
      // Exclui parceiros e banners
      await prisma.$transaction([
        prisma.partnerBanner.deleteMany(),
        prisma.partner.deleteMany(),
      ])
    }

    if (group === 'notifications' || group === 'all') {
      // Limpa os logs de notificações
      await prisma.notificationLog.deleteMany()
    }

    if (group === 'customers' || group === 'all') {
      // Excluir clientes é a ação mais pesada, pois eles têm muitas dependências
      await prisma.$transaction([
        prisma.loyaltyTransaction.deleteMany(),
        prisma.loyaltyAccount.deleteMany(),
        prisma.orderItem.deleteMany(),
        prisma.order.deleteMany(),
        prisma.address.deleteMany(),
        prisma.pushToken.deleteMany(),
        prisma.userLocation.deleteMany(),
        prisma.otpCode.deleteMany(),
        prisma.user.deleteMany({
          where: { role: 'CUSTOMER' }, // APENAS clientes são excluídos, equipe se mantém
        })
      ])
    }

    return reply.status(204).send()
  } catch (error) {
    console.error('Erro ao limpar tabela:', error)
    return reply.status(500).send({ message: 'Erro ao limpar dados no banco de dados. Alguma restrição de chave estrangeira pode estar impedindo a ação.' })
  }
}

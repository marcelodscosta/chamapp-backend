import { PrismaClient, OrderStatus } from './src/generated/prisma'
const prisma = new PrismaClient()
async function main() {
  const orders = await prisma.order.findMany({
    where: { status: { in: [OrderStatus.DELIVERED, OrderStatus.CONFIRMED, OrderStatus.OUT_FOR_DELIVERY] } },
    include: { items: true }
  })
  let faturamento = 0
  let receitaItens = 0
  let discount = 0
  for (const o of orders) {
    faturamento += Number(o.total_value)
    discount += Number(o.points_discount || 0)
    for (const i of o.items) {
      receitaItens += Number(i.subtotal)
    }
  }
  console.log({ faturamento, receitaItens, discount, orders: orders.length })
}
main()

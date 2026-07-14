import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const users = await prisma.user.count()
  const orders = await prisma.order.count()
  const products = await prisma.product.count()
  console.log(`Users: ${users}`)
  console.log(`Orders: ${orders}`)
  console.log(`Products: ${products}`)
}
main().catch(console.error).finally(() => prisma.$disconnect())

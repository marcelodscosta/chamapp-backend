import { prisma } from './src/lib/prisma'
async function main() {
  const u = await prisma.user.findMany()
  console.log('USERS:', u)
}
main()

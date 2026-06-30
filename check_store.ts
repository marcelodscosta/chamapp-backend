import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const store = await prisma.storeSettings.findFirst()
  console.log(JSON.stringify(store, null, 2))
}
main()

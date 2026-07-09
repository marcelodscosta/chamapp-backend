const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
async function main() {
  const locs = await prisma.userLocation.findMany();
  console.log("Locais no banco de dados:", locs);
}
main().catch(console.error).finally(() => prisma.$disconnect());

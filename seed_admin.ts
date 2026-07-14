import { PrismaClient } from './src/generated/prisma'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@chamapp.com'
  const password = 'admin'
  const name = 'Administrador'

  const passwordHash = await hash(password, 6)

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password_hash: passwordHash,
      role: 'ADMIN',
      is_active: true,
    },
    create: {
      email,
      name,
      password_hash: passwordHash,
      role: 'ADMIN',
      is_active: true,
    },
  })

  console.log('✅ Admin user created/updated successfully!')
  console.log(`Email: ${admin.email}`)
  console.log(`Password: ${password}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

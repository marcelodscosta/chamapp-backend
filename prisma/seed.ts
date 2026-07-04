import { PrismaClient, Role } from '../src/generated/prisma'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // ─── Admin padrão ───────────────────────────────────────────────────────────
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@chamapp.com' },
  })

  if (!adminExists) {
    const passwordHash = await hash('admin123456', 10)
    await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@chamapp.com',
        password_hash: passwordHash,
        role: Role.ADMIN,
        phone: '(11) 99999-0001',
      },
    })
    console.log('✅ Admin criado: admin@chamapp.com / admin123456')
  } else {
    console.log('ℹ️  Admin já existe, pulando.')
  }

  // ─── Configurações da loja ──────────────────────────────────────────────────
  const settingsCount = await prisma.storeSettings.count()
  if (settingsCount === 0) {
    await prisma.storeSettings.create({
      data: {
        name: 'ChamApp Gás',
        phone: '(11) 3333-4444',
        delivery_fee: 5.0,
        free_delivery_above: 100.0,
        min_order_value: 30.0,
        store_open: true,
        opening_time: '07:00',
        closing_time: '22:00',
      },
    })
    console.log('✅ Configurações da loja criadas.')
  }

  // ─── Categorias padrão ──────────────────────────────────────────────────────
  const categories = [
    { name: 'Botijões', order: 1 },
    { name: 'Acessórios', order: 2 },
    { name: 'Combos', order: 3 },
  ]

  for (const cat of categories) {
    await prisma.productCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    })
  }
  console.log('✅ Categorias criadas: Botijões, Acessórios, Combos.')

  // ─── Produto de exemplo ─────────────────────────────────────────────────────
  const botijoesCategory = await prisma.productCategory.findUnique({
    where: { name: 'Botijões' },
  })

  const productExists = await prisma.product.findFirst({
    where: { name: 'Botijão P13 13kg' },
  })

  if (!productExists && botijoesCategory) {
    await prisma.product.create({
      data: {
        categoryId: botijoesCategory.id,
        name: 'Botijão P13 13kg',
        description: 'Botijão de gás GLP 13kg. Troca com botijão vazio.',
        price: 110.0,
        requires_empty_return: true,
        is_available: true,
        earns_points: true,
      },
    })
    console.log('✅ Produto de exemplo criado: Botijão P13.')
  }

  // ─── Config do programa de pontos ──────────────────────────────────────────
  const loyaltyConfigCount = await prisma.loyaltyConfig.count()
  if (loyaltyConfigCount === 0) {
    await prisma.loyaltyConfig.create({
      data: {
        program_enabled: true,
        points_per_real: 10,
        conversion_rate: 0.10,
        min_points_to_redeem: 500,
        max_redeem_percent: 50,
        expiry_days: 365,
        inactivity_days: 90,
        expiry_alert_days: [15, 7],
      },
    })
    console.log('✅ Configuração de loyalty criada.')
  }

  // ─── Tiers de fidelidade ────────────────────────────────────────────────────
  const tiers = [
    { name: 'Bronze', min_spent: 0, period_days: 30, multiplier: 1.0, color_hex: '#CD7F32', order: 1, benefits: ['Acesso básico ao programa de pontos'] },
    { name: 'Prata', min_spent: 150, period_days: 30, multiplier: 1.25, color_hex: '#C0C0C0', order: 2, benefits: ['Pontos bônus 1.25x', 'Frete grátis acima de R$ 80'] },
    { name: 'Ouro', min_spent: 300, period_days: 30, multiplier: 1.5, color_hex: '#FFD700', order: 3, benefits: ['Pontos bônus 1.5x', 'Prioridade no atendimento'] },
    { name: 'Diamante', min_spent: 500, period_days: 30, multiplier: 2.0, color_hex: '#B9F2FF', order: 4, benefits: ['Pontos bônus 2x', 'Ofertas exclusivas', 'Push VIP'] },
  ]

  for (const tier of tiers) {
    await prisma.loyaltyTier.upsert({
      where: { name: tier.name },
      update: {},
      create: tier,
    })
  }
  console.log('✅ Tiers de fidelidade criados: Bronze, Prata, Ouro, Diamante.')

  console.log('\n🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

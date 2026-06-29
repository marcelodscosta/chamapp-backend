import { prisma } from './src/lib/prisma'
import { hash } from 'bcryptjs'

async function main() {
  console.log('Generating developer test data...')

  // 1. Criar ou atualizar o Marcelo Costa
  const passwordHash = await hash('123456', 10)
  const user = await prisma.user.upsert({
    where: { email: 'marcelodscosta@yahoo.com.br' },
    update: { is_active: true },
    create: {
      id: '09a1ce45-5517-4ffb-adbe-4e0d9765d276',
      name: 'Marcelo Costa',
      email: 'marcelodscosta@yahoo.com.br',
      password_hash: passwordHash,
      role: 'CUSTOMER',
      phone: '74981316568',
      is_active: true,
    }
  })

  // 2. Garantir conta de loyalty
  const bronzeTier = await prisma.loyaltyTier.findFirst({ where: { name: 'Bronze' } })
  if (bronzeTier) {
    await prisma.loyaltyAccount.upsert({
      where: { customerId: user.id },
      update: {},
      create: {
        customerId: user.id,
        tierId: bronzeTier.id,
        balance_points: 0,
      }
    })
  }

  // 3. Criar endereço
  const address = await prisma.address.upsert({
    where: { id: 'b1183372-a728-4d7c-b934-ffd86326c029' },
    update: {},
    create: {
      id: 'b1183372-a728-4d7c-b934-ffd86326c029',
      customerId: user.id,
      street: 'Rua Nossa Senhora das Candeias',
      number: '428',
      neighborhood: 'Jardim Florinda',
      city: 'Juazeiro',
      state: 'Ba',
      zip_code: '48900604',
    }
  })

  // 4. Garantir produto
  let product = await prisma.product.findFirst({ where: { name: 'Botijão P13 13kg' } })
  if (!product) {
    const cat = await prisma.productCategory.findFirst()
    product = await prisma.product.create({
      data: {
        id: '253c28f1-1468-46a3-bdcb-c5f27e363cf8',
        name: 'Botijão P13 13kg',
        price: 110.0,
        categoryId: cat?.id || null,
        is_available: true,
      }
    })
  }

  // 5. Criar pedido cancelado
  const orderExists = await prisma.order.findUnique({ where: { id: '2ccd5d15-edcf-4af4-b454-28000a1fabc6' } })
  if (!orderExists) {
    await prisma.order.create({
      data: {
        id: '2ccd5d15-edcf-4af4-b454-28000a1fabc6',
        order_number: '20260622-0001',
        customerId: user.id,
        addressId: address.id,
        status: 'CANCELLED',
        payment_method: 'PIX',
        subtotal: 440,
        delivery_fee: 0,
        total_value: 440,
        cancelled_at: new Date('2026-06-29T18:52:33.506Z'),
        items: {
          create: [
            {
              productId: product.id,
              name: product.name,
              price: 110,
              quantity: 4,
              subtotal: 440,
            }
          ]
        }
      }
    })
  }

  // 6. Criar Parceiro Comercial
  const partner = await prisma.partner.upsert({
    where: { id: 'a52a3b04-f5eb-42cc-a0ff-3e4b0258d451' },
    update: { is_active: true },
    create: {
      id: 'a52a3b04-f5eb-42cc-a0ff-3e4b0258d451',
      name: 'Farmácia Saúde & Cia',
      logo_url: 'https://images.unsplash.com/photo-1607619056574-7b8d304b3b86?w=200&auto=format&fit=crop',
      description: 'Apresente seu pedido finalizado do ChamApp Gás e ganhe 15% de desconto em qualquer medicamento genérico!',
      phone: '74988887777',
      address: 'Praça da Misericórdia, 12 - Centro, Juazeiro - BA',
      website: 'https://instagram.com/farmaciasaudecia',
      is_active: true,
    }
  })

  // 7. Criar Banner do Parceiro
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 30)

  await prisma.partnerBanner.upsert({
    where: { id: 'f87a8b09-bde8-48fe-89ae-38ff02a0a2df' },
    update: { is_active: true },
    create: {
      id: 'f87a8b09-bde8-48fe-89ae-38ff02a0a2df',
      partnerId: partner.id,
      image_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=60',
      target_type: 'PARTNER_PROFILE',
      priority: 1,
      is_active: true,
      expires_at: tomorrow,
    }
  })

  console.log('Test data created successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import {
  makeGetLoyaltyConfig,
  makeUpdateLoyaltyConfig,
  makeCreateLoyaltyTier,
  makeGetLoyaltyAccount,
} from '../../../services/factories/make-loyalty'
import { LoyaltyMode } from '../../../generated/prisma'

export async function getLoyaltyConfig(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const useCase = makeGetLoyaltyConfig()
  const { config } = await useCase.execute()
  return reply.status(200).send({ config })
}

const updateLoyaltyConfigBodySchema = z.object({
  program_enabled: z.boolean().optional(),
  program_mode: z.nativeEnum(LoyaltyMode).optional(),
  points_per_real: z.number().min(0).optional(),
  conversion_rate: z.number().min(0).optional(),
  min_points_to_redeem: z.number().int().min(0).optional(),
  max_redeem_percent: z.number().min(0).max(100).optional(),
  expiry_days: z.number().int().min(1).optional(),
  inactivity_days: z.number().int().min(1).optional(),
})

export async function updateLoyaltyConfig(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = updateLoyaltyConfigBodySchema.parse(request.body)
  const useCase = makeUpdateLoyaltyConfig()
  const { config } = await useCase.execute(data)
  return reply.status(200).send({ config })
}

const createTierBodySchema = z.object({
  name: z.string().min(2),
  min_spent: z.number().min(0),
  period_days: z.number().int().min(1),
  multiplier: z.number().min(1).optional(),
  color_hex: z.string().optional(),
  icon_url: z.string().url().optional(),
  benefits: z.array(z.string()).optional(),
  order: z.number().int().optional(),
})

export async function createLoyaltyTier(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = createTierBodySchema.parse(request.body)
  const useCase = makeCreateLoyaltyTier()
  const { tier } = await useCase.execute(data)
  return reply.status(201).send({ tier })
}

export async function listLoyaltyTiers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const tiers = await prisma.loyaltyTier.findMany({
    orderBy: { min_spent: 'asc' },
  })
  return reply.status(200).send({ tiers })
}

const updateTierParamsSchema = z.object({
  id: z.string().uuid(),
})

const updateTierBodySchema = z.object({
  name: z.string().min(2).optional(),
  min_spent: z.number().min(0).optional(),
  period_days: z.number().int().min(1).optional(),
  multiplier: z.number().min(1).optional(),
  color_hex: z.string().optional(),
  icon_url: z.string().url().optional(),
  benefits: z.array(z.string()).optional(),
  order: z.number().int().optional(),
})

export async function updateLoyaltyTier(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateTierParamsSchema.parse(request.params)
  const data = updateTierBodySchema.parse(request.body)

  const tier = await prisma.loyaltyTier.update({
    where: { id },
    data,
  })

  return reply.status(200).send({ tier })
}

export async function getLoyaltyAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const useCase = makeGetLoyaltyAccount()
  // Cliente consulta sua própria conta
  const { account, transactions } = await useCase.execute(request.user!.id)
  return reply.status(200).send({ account, transactions })
}

export async function deleteLoyaltyTier(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateTierParamsSchema.parse(request.params)

  await prisma.loyaltyTier.delete({
    where: { id },
  })

  return reply.status(204).send()
}

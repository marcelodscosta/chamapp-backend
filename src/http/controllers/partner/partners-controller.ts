import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import {
  makeCreatePartner,
  makeListPartners,
  makeUpdatePartner,
  makeDeletePartner,
  makeCreateBanner,
  makeListBanners,
  makeListActiveBanners,
  makeUpdateBanner,
  makeDeleteBanner,
  makeTrackBannerInteraction,
  makeGetPartner,
} from '../../../services/factories/make-partners'
import { BannerTargetType } from '../../../generated/prisma'

// --- Parceiros ---
const createPartnerBodySchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres.'),
  logo_url: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
})

export async function createPartner(request: FastifyRequest, reply: FastifyReply) {
  const data = createPartnerBodySchema.parse(request.body)
  const useCase = makeCreatePartner()
  const { partner } = await useCase.execute({
    ...data,
    logo_url: data.logo_url || undefined,
    website: data.website || undefined,
  })
  return reply.status(201).send({ partner })
}

export async function listPartners(_request: FastifyRequest, reply: FastifyReply) {
  const useCase = makeListPartners()
  const { partners } = await useCase.execute()
  return reply.status(200).send({ partners })
}

const updatePartnerParamsSchema = z.object({
  id: z.string().uuid(),
})

const updatePartnerBodySchema = z.object({
  name: z.string().min(2).optional(),
  logo_url: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  is_active: z.boolean().optional(),
})

export async function updatePartner(request: FastifyRequest, reply: FastifyReply) {
  const { id } = updatePartnerParamsSchema.parse(request.params)
  const data = updatePartnerBodySchema.parse(request.body)
  const useCase = makeUpdatePartner()
  const { partner } = await useCase.execute({
    id,
    ...data,
    logo_url: data.logo_url || undefined,
    website: data.website || undefined,
  })
  return reply.status(200).send({ partner })
}

const deletePartnerParamsSchema = z.object({
  id: z.string().uuid(),
})

export async function deletePartner(request: FastifyRequest, reply: FastifyReply) {
  const { id } = deletePartnerParamsSchema.parse(request.params)
  const useCase = makeDeletePartner()
  await useCase.execute({ id })
  return reply.status(204).send()
}

const getPartnerParamsSchema = z.object({
  id: z.string().uuid(),
})

export async function getPartner(request: FastifyRequest, reply: FastifyReply) {
  const { id } = getPartnerParamsSchema.parse(request.params)
  const useCase = makeGetPartner()
  const { partner } = await useCase.execute({ id })
  return reply.status(200).send({ partner })
}


// --- Banners ---
const createBannerBodySchema = z.object({
  partnerId: z.string().uuid(),
  image_url: z.string().url(),
  target_type: z.nativeEnum(BannerTargetType),
  target_url: z.string().optional(),
  priority: z.number().int().optional(),
  expires_at: z.string().datetime().optional().or(z.string().date().optional()),
})

export async function createBanner(request: FastifyRequest, reply: FastifyReply) {
  const data = createBannerBodySchema.parse(request.body)
  const useCase = makeCreateBanner()
  const { banner } = await useCase.execute(data)
  return reply.status(201).send({ banner })
}

export async function listBanners(_request: FastifyRequest, reply: FastifyReply) {
  const useCase = makeListBanners()
  const { banners } = await useCase.execute()
  return reply.status(200).send({ banners })
}

export async function listActiveBanners(_request: FastifyRequest, reply: FastifyReply) {
  const useCase = makeListActiveBanners()
  const { banners } = await useCase.execute()
  return reply.status(200).send({ banners })
}

const updateBannerParamsSchema = z.object({
  id: z.string().uuid(),
})

const updateBannerBodySchema = z.object({
  image_url: z.string().url().optional(),
  target_type: z.nativeEnum(BannerTargetType).optional(),
  target_url: z.string().optional(),
  priority: z.number().int().optional(),
  is_active: z.boolean().optional(),
  expires_at: z.string().datetime().nullable().optional(),
})

export async function updateBanner(request: FastifyRequest, reply: FastifyReply) {
  const { id } = updateBannerParamsSchema.parse(request.params)
  const data = updateBannerBodySchema.parse(request.body)
  const useCase = makeUpdateBanner()
  const { banner } = await useCase.execute({
    id,
    ...data,
    expires_at: data.expires_at ? new Date(data.expires_at) : data.expires_at,
  })
  return reply.status(200).send({ banner })
}

const deleteBannerParamsSchema = z.object({
  id: z.string().uuid(),
})

export async function deleteBanner(request: FastifyRequest, reply: FastifyReply) {
  const { id } = deleteBannerParamsSchema.parse(request.params)
  const useCase = makeDeleteBanner()
  await useCase.execute({ id })
  return reply.status(204).send()
}

const trackInteractionParamsSchema = z.object({
  id: z.string().uuid(),
})

const trackInteractionBodySchema = z.object({
  interaction: z.enum(['VIEW', 'CLICK']),
})

export async function trackInteraction(request: FastifyRequest, reply: FastifyReply) {
  const { id } = trackInteractionParamsSchema.parse(request.params)
  const { interaction } = trackInteractionBodySchema.parse(request.body)
  const useCase = makeTrackBannerInteraction()
  await useCase.execute({ id, interaction })
  return reply.status(204).send()
}

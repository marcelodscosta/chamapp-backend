import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import {
  makeGetStoreSettings,
  makeUpdateStoreSettings,
} from '../../../services/factories/make-store-settings'

export async function getStoreSettings(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const useCase = makeGetStoreSettings()
  const { settings } = await useCase.execute()

  return reply.status(200).send({ settings })
}

const updateSettingsBodySchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  logo_url: z.string().url().optional(),
  address: z.string().optional(),
  delivery_fee: z.number().min(0).optional(),
  free_delivery_above: z.number().min(0).nullable().optional(),
  min_order_value: z.number().min(0).optional(),
  store_open: z.boolean().optional(),
  opening_time: z.string().nullable().optional(),
  closing_time: z.string().nullable().optional(),
})

export async function updateStoreSettings(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = updateSettingsBodySchema.parse(request.body)

  const useCase = makeUpdateStoreSettings()
  const { settings } = await useCase.execute(data)

  return reply.status(200).send({ settings })
}

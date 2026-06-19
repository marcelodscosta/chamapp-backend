import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateAddress } from '../../../services/factories/make-create-address'
import { makeListAddresses } from '../../../services/factories/make-list-addresses'
import { makeUpdateAddress } from '../../../services/factories/make-update-address'
import { makeDeleteAddress } from '../../../services/factories/make-delete-address'
import { makeSetDefaultAddress } from '../../../services/factories/make-set-default-address'

const createAddressBodySchema = z.object({
  label: z.string().optional(),
  street: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional(),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2),
  zip_code: z.string().min(8),
  reference: z.string().optional(),
  is_default: z.boolean().optional(),
})

export async function createAddress(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = createAddressBodySchema.parse(request.body)

  const useCase = makeCreateAddress()
  const { address } = await useCase.execute({
    customerId: request.user.sub,
    ...data,
  })

  return reply.status(201).send({ address })
}

export async function listAddresses(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const useCase = makeListAddresses()
  const { addresses } = await useCase.execute({
    customerId: request.user.sub,
  })

  return reply.status(200).send({ addresses })
}

const updateAddressParamsSchema = z.object({
  id: z.string().uuid(),
})

const updateAddressBodySchema = z.object({
  label: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2).optional(),
  zip_code: z.string().optional(),
  reference: z.string().optional(),
})

export async function updateAddress(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateAddressParamsSchema.parse(request.params)
  const data = updateAddressBodySchema.parse(request.body)

  const useCase = makeUpdateAddress()
  const { address } = await useCase.execute({
    addressId: id,
    customerId: request.user.sub,
    ...data,
  })

  return reply.status(200).send({ address })
}

const deleteAddressParamsSchema = z.object({
  id: z.string().uuid(),
})

export async function deleteAddress(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = deleteAddressParamsSchema.parse(request.params)

  const useCase = makeDeleteAddress()
  await useCase.execute({
    addressId: id,
    customerId: request.user.sub,
  })

  return reply.status(204).send()
}

const setDefaultAddressParamsSchema = z.object({
  id: z.string().uuid(),
})

export async function setDefaultAddress(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = setDefaultAddressParamsSchema.parse(request.params)

  const useCase = makeSetDefaultAddress()
  await useCase.execute({
    addressId: id,
    customerId: request.user.sub,
  })

  return reply.status(204).send()
}

import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateProduct } from '../../../services/factories/make-create-product'
import { makeUpdateProduct } from '../../../services/factories/make-update-product'
import { makeGetProduct } from '../../../services/factories/make-get-product'
import { makeListProducts } from '../../../services/factories/make-list-products'
import { makeToggleProductAvailability } from '../../../services/factories/make-toggle-product-availability'

const createProductBodySchema = z.object({
  categoryId: z.string().uuid().optional(),
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  imageUrl: z.string().url().optional(),
  requiresEmptyReturn: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  earnsPoints: z.boolean().optional(),
  pointsOverride: z.number().int().optional(),
  pointsMultiplier: z.number().optional(),
})

export async function createProduct(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = createProductBodySchema.parse(request.body)

  const useCase = makeCreateProduct()
  const { product } = await useCase.execute(data)

  return reply.status(201).send({ product })
}

const updateProductParamsSchema = z.object({
  id: z.string().uuid(),
})

const updateProductBodySchema = z.object({
  categoryId: z.string().uuid().optional(),
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
  requiresEmptyReturn: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  isActive: z.boolean().optional(),
  earnsPoints: z.boolean().optional(),
  pointsOverride: z.number().int().optional(),
  pointsMultiplier: z.number().optional(),
})

export async function updateProduct(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateProductParamsSchema.parse(request.params)
  const data = updateProductBodySchema.parse(request.body)

  const useCase = makeUpdateProduct()
  const { product } = await useCase.execute({
    productId: id,
    ...data,
  })

  return reply.status(200).send({ product })
}

const getProductParamsSchema = z.object({
  id: z.string().uuid(),
})

export async function getProduct(request: FastifyRequest, reply: FastifyReply) {
  const { id } = getProductParamsSchema.parse(request.params)

  const useCase = makeGetProduct()
  const { product } = await useCase.execute({ productId: id })

  return reply.status(200).send({ product })
}

const listProductsQuerySchema = z.object({
  categoryId: z.string().uuid().optional(),
  onlyAvailable: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).optional(),
})

export async function listProducts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { categoryId, onlyAvailable, page, limit } =
    listProductsQuerySchema.parse(request.query)

  const useCase = makeListProducts()
  const result = await useCase.execute({
    categoryId,
    onlyAvailable,
    page,
    limit,
  })

  return reply.status(200).send(result)
}

const toggleAvailabilityParamsSchema = z.object({
  id: z.string().uuid(),
})

export async function toggleProductAvailability(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = toggleAvailabilityParamsSchema.parse(request.params)

  const useCase = makeToggleProductAvailability()
  const { product } = await useCase.execute({ productId: id })

  return reply.status(200).send({ product })
}

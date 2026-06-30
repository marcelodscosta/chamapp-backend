import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateCategory } from '../../../services/factories/make-create-category'
import { makeListCategories } from '../../../services/factories/make-list-categories'
import { makeUpdateCategory } from '../../../services/factories/make-update-category'

const createCategoryBodySchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres.'),
  order: z.number().int().optional(),
  imageUrl: z.string().url().optional(),
})

export async function createCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { name, order, imageUrl } = createCategoryBodySchema.parse(request.body)

  const useCase = makeCreateCategory()
  const { category } = await useCase.execute({ name, order, imageUrl })

  return reply.status(201).send({ category })
}

export async function listCategories(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const useCase = makeListCategories()
  const { categories } = await useCase.execute()

  return reply.status(200).send({ categories })
}

const updateCategoryParamsSchema = z.object({
  id: z.string().uuid(),
})

const updateCategoryBodySchema = z.object({
  name: z.string().min(2).optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
})

export async function updateCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateCategoryParamsSchema.parse(request.params)
  const { name, order, isActive, imageUrl } = updateCategoryBodySchema.parse(request.body)

  const useCase = makeUpdateCategory()
  const { category } = await useCase.execute({
    categoryId: id,
    name,
    order,
    isActive,
    imageUrl,
  })

  return reply.status(200).send({ category })
}

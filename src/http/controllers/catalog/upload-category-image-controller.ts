import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUploadCategoryImage } from '../../../services/factories/make-upload-category-image'
import { AppError } from '../../../services/errors/app-error'

const uploadImageParamsSchema = z.object({
  id: z.string().uuid(),
})

export async function uploadCategoryImage(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = uploadImageParamsSchema.parse(request.params)

  const data = await request.file()

  if (!data) {
    throw new AppError('Nenhum arquivo enviado.', 400)
  }

  const fileBuffer = await data.toBuffer()

  const useCase = makeUploadCategoryImage()
  const { category } = await useCase.execute({
    categoryId: id,
    fileName: data.filename,
    mimetype: data.mimetype,
    file: fileBuffer,
  })

  return reply.status(200).send({ category })
}

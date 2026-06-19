import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUploadProductImage } from '../../../services/factories/make-upload-product-image'
import { AppError } from '../../../services/errors/app-error'

const uploadImageParamsSchema = z.object({
  id: z.string().uuid(),
})

export async function uploadProductImage(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = uploadImageParamsSchema.parse(request.params)

  const data = await request.file()

  if (!data) {
    throw new AppError('Nenhum arquivo enviado.', 400)
  }

  const fileBuffer = await data.toBuffer()

  const useCase = makeUploadProductImage()
  const { product } = await useCase.execute({
    productId: id,
    fileName: data.filename,
    mimetype: data.mimetype,
    file: fileBuffer,
  })

  return reply.status(200).send({ product })
}

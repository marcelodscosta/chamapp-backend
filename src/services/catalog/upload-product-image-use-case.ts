import { Product } from '../../generated/prisma'
import { IProductRepository } from '../../repositories/interfaces/IProductRepository'
import { IStorageProvider } from '../../providers/StorageProvider/IStorageProvider'
import { AppError } from '../errors/app-error'
import { randomUUID } from 'node:crypto'

interface UploadProductImageRequest {
  productId: string
  fileName: string
  mimetype: string
  file: Buffer
}

interface UploadProductImageResponse {
  product: Product
}

export class UploadProductImageUseCase {
  constructor(
    private productRepository: IProductRepository,
    private storageProvider: IStorageProvider,
  ) {}

  async execute({
    productId,
    fileName,
    mimetype,
    file,
  }: UploadProductImageRequest): Promise<UploadProductImageResponse> {
    const product = await this.productRepository.findById(productId)

    if (!product) {
      throw new AppError('Produto não encontrado.', 404)
    }

    if (!mimetype.startsWith('image/')) {
      throw new AppError('O arquivo deve ser uma imagem.', 400)
    }

    // Se já tinha imagem, exclui do bucket
    if (product.image_url) {
      const oldFileName = product.image_url.split('/').pop()
      if (oldFileName) {
        await this.storageProvider.deleteFile(oldFileName)
      }
    }

    // Cria nome único
    const fileExtension = fileName.split('.').pop()
    const newFileName = `${productId}-${randomUUID()}.${fileExtension}`

    const fileUrl = await this.storageProvider.saveFile(
      file,
      newFileName,
      mimetype,
    )

    const updatedProduct = await this.productRepository.update(productId, {
      image_url: fileUrl,
    })

    return { product: updatedProduct }
  }
}

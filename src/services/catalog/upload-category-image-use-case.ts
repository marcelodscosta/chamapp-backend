import { ProductCategory } from '../../generated/prisma'
import { ICategoryRepository } from '../../repositories/interfaces/ICategoryRepository'
import { IStorageProvider } from '../../providers/StorageProvider/IStorageProvider'
import { AppError } from '../errors/app-error'
import { randomUUID } from 'node:crypto'

interface UploadCategoryImageRequest {
  categoryId: string
  fileName: string
  mimetype: string
  file: Buffer
}

interface UploadCategoryImageResponse {
  category: ProductCategory
}

export class UploadCategoryImageUseCase {
  constructor(
    private categoryRepository: ICategoryRepository,
    private storageProvider: IStorageProvider,
  ) {}

  async execute({
    categoryId,
    fileName,
    mimetype,
    file,
  }: UploadCategoryImageRequest): Promise<UploadCategoryImageResponse> {
    const category = await this.categoryRepository.findById(categoryId)

    if (!category) {
      throw new AppError('Categoria não encontrada.', 404)
    }

    if (!mimetype.startsWith('image/')) {
      throw new AppError('O arquivo deve ser uma imagem.', 400)
    }

    if (category.image_url) {
      const oldFileName = category.image_url.split('/').pop()
      if (oldFileName) {
        await this.storageProvider.deleteFile(oldFileName)
      }
    }

    const fileExtension = fileName.split('.').pop()
    const newFileName = `cat-${categoryId}-${randomUUID()}.${fileExtension}`

    const fileUrl = await this.storageProvider.saveFile(
      file,
      newFileName,
      mimetype,
    )

    const updatedCategory = await this.categoryRepository.update(categoryId, {
      image_url: fileUrl,
    })

    return { category: updatedCategory }
  }
}

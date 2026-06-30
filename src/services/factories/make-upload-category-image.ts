import { UploadCategoryImageUseCase } from '../catalog/upload-category-image-use-case'
import { PrismaCategoryRepository } from '../../repositories/prisma/prisma-category-repository'
import { S3StorageProvider } from '../../providers/StorageProvider/S3StorageProvider'

export function makeUploadCategoryImage() {
  const categoryRepository = new PrismaCategoryRepository()
  const storageProvider = new S3StorageProvider()
  return new UploadCategoryImageUseCase(categoryRepository, storageProvider)
}

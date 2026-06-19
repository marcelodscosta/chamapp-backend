import { PrismaProductRepository } from '../../repositories/prisma/prisma-product-repository'
import { S3StorageProvider } from '../../providers/StorageProvider/S3StorageProvider'
import { UploadProductImageUseCase } from '../catalog/upload-product-image-use-case'

export function makeUploadProductImage() {
  const repository = new PrismaProductRepository()
  const storageProvider = new S3StorageProvider()
  return new UploadProductImageUseCase(repository, storageProvider)
}

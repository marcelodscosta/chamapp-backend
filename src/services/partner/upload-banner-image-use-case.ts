import { PartnerBanner } from '../../generated/prisma'
import { IPartnerRepository } from '../../repositories/interfaces/IPartnerRepository'
import { IStorageProvider } from '../../providers/StorageProvider/IStorageProvider'
import { AppError } from '../errors/app-error'
import { randomUUID } from 'node:crypto'

interface UploadBannerImageRequest {
  bannerId: string
  fileName: string
  mimetype: string
  file: Buffer
}

interface UploadBannerImageResponse {
  banner: PartnerBanner
}

export class UploadBannerImageUseCase {
  constructor(
    private partnerRepository: IPartnerRepository,
    private storageProvider: IStorageProvider,
  ) {}

  async execute({
    bannerId,
    fileName,
    mimetype,
    file,
  }: UploadBannerImageRequest): Promise<UploadBannerImageResponse> {
    const banner = await this.partnerRepository.findBannerById(bannerId)

    if (!banner) {
      throw new AppError('Banner não encontrado.', 404)
    }

    if (!mimetype.startsWith('image/')) {
      throw new AppError('O arquivo deve ser uma imagem.', 400)
    }

    // Se já tinha imagem, exclui do bucket
    if (banner.image_url) {
      const oldFileName = banner.image_url.split('/').pop()
      if (oldFileName) {
        await this.storageProvider.deleteFile(oldFileName).catch(() => {})
      }
    }

    // Cria nome único
    const fileExtension = fileName.split('.').pop()
    const newFileName = `partner-banner-${bannerId}-${randomUUID()}.${fileExtension}`

    const fileUrl = await this.storageProvider.saveFile(
      file,
      newFileName,
      mimetype,
    )

    const updatedBanner = await this.partnerRepository.updateBanner(bannerId, {
      image_url: fileUrl,
    })

    return { banner: updatedBanner }
  }
}

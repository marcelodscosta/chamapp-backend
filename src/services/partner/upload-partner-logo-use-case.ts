import { Partner } from '../../generated/prisma'
import { IPartnerRepository } from '../../repositories/interfaces/IPartnerRepository'
import { IStorageProvider } from '../../providers/StorageProvider/IStorageProvider'
import { AppError } from '../errors/app-error'
import { randomUUID } from 'node:crypto'

interface UploadPartnerLogoRequest {
  partnerId: string
  fileName: string
  mimetype: string
  file: Buffer
}

interface UploadPartnerLogoResponse {
  partner: Partner
}

export class UploadPartnerLogoUseCase {
  constructor(
    private partnerRepository: IPartnerRepository,
    private storageProvider: IStorageProvider,
  ) {}

  async execute({
    partnerId,
    fileName,
    mimetype,
    file,
  }: UploadPartnerLogoRequest): Promise<UploadPartnerLogoResponse> {
    const partner = await this.partnerRepository.findPartnerById(partnerId)

    if (!partner) {
      throw new AppError('Parceiro não encontrado.', 404)
    }

    if (!mimetype.startsWith('image/')) {
      throw new AppError('O arquivo deve ser uma imagem.', 400)
    }

    // Se já tinha imagem, exclui do bucket
    if (partner.logo_url) {
      const oldFileName = partner.logo_url.split('/').pop()
      if (oldFileName) {
        await this.storageProvider.deleteFile(oldFileName).catch(() => {})
      }
    }

    // Cria nome único
    const fileExtension = fileName.split('.').pop()
    const newFileName = `partner-logo-${partnerId}-${randomUUID()}.${fileExtension}`

    const fileUrl = await this.storageProvider.saveFile(
      file,
      newFileName,
      mimetype,
    )

    const updatedPartner = await this.partnerRepository.updatePartner(partnerId, {
      logo_url: fileUrl,
    })

    return { partner: updatedPartner }
  }
}

import { IPartnerRepository } from '../../repositories/interfaces/IPartnerRepository'
import { PartnerBanner, BannerTargetType } from '../../generated/prisma'
import { AppError } from '../errors/app-error'

interface CreateBannerRequest {
  partnerId: string
  image_url: string
  target_type: BannerTargetType
  target_url?: string
  priority?: number
  expires_at?: Date | string
}

interface CreateBannerResponse {
  banner: PartnerBanner
}

export class CreateBannerUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async execute(data: CreateBannerRequest): Promise<CreateBannerResponse> {
    const partnerExists = await this.partnerRepository.findPartnerById(data.partnerId)
    if (!partnerExists) {
      throw new AppError('Parceiro associado não encontrado.', 404)
    }

    if (!data.image_url || data.image_url.trim() === '') {
      throw new AppError('A URL da imagem do banner é obrigatória.', 400)
    }

    const banner = await this.partnerRepository.createBanner(data)
    return { banner }
  }
}

import { IPartnerRepository } from '../../repositories/interfaces/IPartnerRepository'
import { PartnerBanner, BannerTargetType } from '../../generated/prisma'
import { AppError } from '../errors/app-error'

interface UpdateBannerRequest {
  id: string
  image_url?: string
  target_type?: BannerTargetType
  target_url?: string
  priority?: number
  is_active?: boolean
  expires_at?: Date | string | null
}

interface UpdateBannerResponse {
  banner: PartnerBanner
}

export class UpdateBannerUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async execute(data: UpdateBannerRequest): Promise<UpdateBannerResponse> {
    const bannerExists = await this.partnerRepository.findBannerById(data.id)
    if (!bannerExists) {
      throw new AppError('Banner não encontrado.', 404)
    }

    const { id, ...updateData } = data
    const banner = await this.partnerRepository.updateBanner(id, updateData)
    return { banner }
  }
}

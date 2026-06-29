import { IPartnerRepository } from '../../repositories/interfaces/IPartnerRepository'
import { AppError } from '../errors/app-error'

interface TrackBannerInteractionRequest {
  id: string
  interaction: 'VIEW' | 'CLICK'
}

export class TrackBannerInteractionUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async execute({ id, interaction }: TrackBannerInteractionRequest): Promise<void> {
    const banner = await this.partnerRepository.findBannerById(id)
    if (!banner) {
      throw new AppError('Banner não encontrado.', 404)
    }

    if (interaction === 'CLICK') {
      await this.partnerRepository.incrementBannerClicks(id)
    } else {
      await this.partnerRepository.incrementBannerViews(id)
    }
  }
}

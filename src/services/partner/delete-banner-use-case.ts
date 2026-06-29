import { IPartnerRepository } from '../../repositories/interfaces/IPartnerRepository'
import { AppError } from '../errors/app-error'

interface DeleteBannerRequest {
  id: string
}

export class DeleteBannerUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async execute({ id }: DeleteBannerRequest): Promise<void> {
    const bannerExists = await this.partnerRepository.findBannerById(id)
    if (!bannerExists) {
      throw new AppError('Banner não encontrado.', 404)
    }

    await this.partnerRepository.deleteBanner(id)
  }
}

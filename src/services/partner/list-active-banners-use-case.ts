import { IPartnerRepository } from '../../repositories/interfaces/IPartnerRepository'
import { PartnerBanner } from '../../generated/prisma'

interface ListActiveBannersResponse {
  banners: PartnerBanner[]
}

export class ListActiveBannersUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async execute(): Promise<ListActiveBannersResponse> {
    const banners = await this.partnerRepository.listActiveBanners()
    return { banners }
  }
}

import { IPartnerRepository } from '../../repositories/interfaces/IPartnerRepository'
import { PartnerBanner } from '../../generated/prisma'

interface ListBannersResponse {
  banners: PartnerBanner[]
}

export class ListBannersUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async execute(): Promise<ListBannersResponse> {
    const banners = await this.partnerRepository.listAllBanners()
    return { banners }
  }
}

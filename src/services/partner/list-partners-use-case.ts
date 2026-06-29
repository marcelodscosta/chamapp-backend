import { IPartnerRepository } from '../../repositories/interfaces/IPartnerRepository'
import { Partner } from '../../generated/prisma'

interface ListPartnersResponse {
  partners: Partner[]
}

export class ListPartnersUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async execute(): Promise<ListPartnersResponse> {
    const partners = await this.partnerRepository.listAllPartners()
    return { partners }
  }
}

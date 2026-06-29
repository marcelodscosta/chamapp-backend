import { IPartnerRepository } from '../../repositories/interfaces/IPartnerRepository'
import { Partner } from '../../generated/prisma'
import { AppError } from '../errors/app-error'

interface GetPartnerRequest {
  id: string
}

interface GetPartnerResponse {
  partner: Partner
}

export class GetPartnerUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async execute({ id }: GetPartnerRequest): Promise<GetPartnerResponse> {
    const partner = await this.partnerRepository.findPartnerById(id)
    if (!partner) {
      throw new AppError('Parceiro não encontrado.', 404)
    }
    return { partner }
  }
}

import { IPartnerRepository } from '../../repositories/interfaces/IPartnerRepository'
import { Partner } from '../../generated/prisma'
import { AppError } from '../errors/app-error'

interface CreatePartnerRequest {
  name: string
  logo_url?: string
  description?: string
  phone?: string
  address?: string
  website?: string
}

interface CreatePartnerResponse {
  partner: Partner
}

export class CreatePartnerUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async execute(data: CreatePartnerRequest): Promise<CreatePartnerResponse> {
    if (!data.name || data.name.trim() === '') {
      throw new AppError('O nome do parceiro é obrigatório.', 400)
    }

    const partner = await this.partnerRepository.createPartner(data)
    return { partner }
  }
}

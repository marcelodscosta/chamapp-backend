import { IPartnerRepository } from '../../repositories/interfaces/IPartnerRepository'
import { Partner } from '../../generated/prisma'
import { AppError } from '../errors/app-error'

interface UpdatePartnerRequest {
  id: string
  name?: string
  logo_url?: string
  description?: string
  phone?: string
  address?: string
  website?: string
  is_active?: boolean
}

interface UpdatePartnerResponse {
  partner: Partner
}

export class UpdatePartnerUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async execute(data: UpdatePartnerRequest): Promise<UpdatePartnerResponse> {
    const partnerExists = await this.partnerRepository.findPartnerById(data.id)
    if (!partnerExists) {
      throw new AppError('Parceiro não encontrado.', 404)
    }

    const { id, ...updateData } = data
    const partner = await this.partnerRepository.updatePartner(id, updateData)
    return { partner }
  }
}

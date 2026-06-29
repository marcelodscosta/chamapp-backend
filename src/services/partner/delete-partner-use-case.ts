import { IPartnerRepository } from '../../repositories/interfaces/IPartnerRepository'
import { AppError } from '../errors/app-error'

interface DeletePartnerRequest {
  id: string
}

export class DeletePartnerUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async execute({ id }: DeletePartnerRequest): Promise<void> {
    const partnerExists = await this.partnerRepository.findPartnerById(id)
    if (!partnerExists) {
      throw new AppError('Parceiro não encontrado.', 404)
    }

    await this.partnerRepository.deletePartner(id)
  }
}

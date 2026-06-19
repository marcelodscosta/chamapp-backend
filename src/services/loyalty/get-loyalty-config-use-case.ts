import { LoyaltyConfig } from '../../generated/prisma'
import { ILoyaltyRepository } from '../../repositories/interfaces/ILoyaltyRepository'

export class GetLoyaltyConfigUseCase {
  constructor(private loyaltyRepository: ILoyaltyRepository) {}

  async execute(): Promise<{ config: LoyaltyConfig | null }> {
    const config = await this.loyaltyRepository.getConfig()
    return { config }
  }
}

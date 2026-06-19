import { LoyaltyConfig } from '../../generated/prisma'
import { ILoyaltyRepository } from '../../repositories/interfaces/ILoyaltyRepository'

export class UpdateLoyaltyConfigUseCase {
  constructor(private loyaltyRepository: ILoyaltyRepository) {}

  async execute(
    data: Partial<LoyaltyConfig>,
  ): Promise<{ config: LoyaltyConfig }> {
    const config = await this.loyaltyRepository.upsertConfig(data)
    return { config }
  }
}

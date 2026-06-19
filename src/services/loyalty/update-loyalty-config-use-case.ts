import { LoyaltyConfig } from '../../generated/prisma'
import {
  ILoyaltyRepository,
  UpdateLoyaltyConfigData,
} from '../../repositories/interfaces/ILoyaltyRepository'

export class UpdateLoyaltyConfigUseCase {
  constructor(private loyaltyRepository: ILoyaltyRepository) {}

  async execute(
    data: UpdateLoyaltyConfigData,
  ): Promise<{ config: LoyaltyConfig }> {
    const config = await this.loyaltyRepository.upsertConfig(data)
    return { config }
  }
}

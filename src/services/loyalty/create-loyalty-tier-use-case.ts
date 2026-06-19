import { LoyaltyTier } from '../../generated/prisma'
import {
  ILoyaltyRepository,
  CreateTierData,
} from '../../repositories/interfaces/ILoyaltyRepository'

export class CreateLoyaltyTierUseCase {
  constructor(private loyaltyRepository: ILoyaltyRepository) {}

  async execute(data: CreateTierData): Promise<{ tier: LoyaltyTier }> {
    const tier = await this.loyaltyRepository.createTier(data)
    return { tier }
  }
}

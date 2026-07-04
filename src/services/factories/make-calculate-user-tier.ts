import { CalculateUserTierUseCase } from '../loyalty/calculate-user-tier-use-case'

export function makeCalculateUserTier() {
  return new CalculateUserTierUseCase()
}

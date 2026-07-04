import { ResetLoyaltyPointsUseCase } from '../loyalty/reset-loyalty-points-use-case'

export function makeResetLoyaltyPoints() {
  return new ResetLoyaltyPointsUseCase()
}

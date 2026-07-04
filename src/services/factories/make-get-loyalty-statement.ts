import { GetLoyaltyStatementUseCase } from '../loyalty/get-loyalty-statement-use-case'

export function makeGetLoyaltyStatement() {
  return new GetLoyaltyStatementUseCase()
}

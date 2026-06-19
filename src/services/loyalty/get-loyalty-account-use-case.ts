import { LoyaltyAccount, LoyaltyTransaction } from '../../generated/prisma'
import { ILoyaltyRepository } from '../../repositories/interfaces/ILoyaltyRepository'

interface GetLoyaltyAccountResponse {
  account: LoyaltyAccount | null
  transactions: LoyaltyTransaction[]
}

export class GetLoyaltyAccountUseCase {
  constructor(private loyaltyRepository: ILoyaltyRepository) {}

  async execute(customerId: string): Promise<GetLoyaltyAccountResponse> {
    const account =
      await this.loyaltyRepository.getAccountByCustomerId(customerId)

    if (!account) {
      return { account: null, transactions: [] }
    }

    const transactions = await this.loyaltyRepository.listTransactionsByAccount(
      account.id,
    )

    return { account, transactions }
  }
}

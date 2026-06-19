import {
  LoyaltyConfig,
  LoyaltyTier,
  LoyaltyAccount,
  LoyaltyTransaction,
  LoyaltyTransactionType,
} from '../../generated/prisma'
import { Decimal } from '../../generated/prisma/runtime/library'

export interface CreateTierData {
  name: string
  min_points: number
  multiplier?: Decimal | number
  color_hex?: string
  icon_url?: string
  benefits?: string[]
  order?: number
}

export interface CreateAccountData {
  customerId: string
  tierId: string
}

export interface AddTransactionData {
  accountId: string
  orderId?: string
  type: LoyaltyTransactionType
  points: number
  cashback_amount?: Decimal | number
  description: string
}

export interface ILoyaltyRepository {
  // Config
  getConfig(): Promise<LoyaltyConfig | null>
  upsertConfig(data: Partial<LoyaltyConfig>): Promise<LoyaltyConfig>

  // Tiers
  createTier(data: CreateTierData): Promise<LoyaltyTier>
  listTiers(): Promise<LoyaltyTier[]>
  findTierByPoints(points: number): Promise<LoyaltyTier | null>

  // Account
  getAccountByCustomerId(customerId: string): Promise<LoyaltyAccount | null>
  createAccount(data: CreateAccountData): Promise<LoyaltyAccount>
  updateAccountBalance(
    accountId: string,
    pointsToAdd: number,
    cashbackToAdd: number,
    isEarned: boolean,
  ): Promise<LoyaltyAccount>

  // Transactions
  createTransaction(
    data: AddTransactionData,
    balanceAfter: number,
  ): Promise<LoyaltyTransaction>
  listTransactionsByAccount(accountId: string): Promise<LoyaltyTransaction[]>
}

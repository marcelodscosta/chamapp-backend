import {
  LoyaltyConfig,
  LoyaltyTier,
  LoyaltyAccount,
  LoyaltyTransaction,
  LoyaltyTransactionType,
  LoyaltyMode,
} from '../../generated/prisma'
import { Decimal } from '../../generated/prisma/runtime/library'

export interface UpdateLoyaltyConfigData {
  program_enabled?: boolean
  program_mode?: LoyaltyMode
  points_per_real?: Decimal | number
  conversion_rate?: Decimal | number
  min_points_to_redeem?: number
  max_redeem_percent?: Decimal | number
  expiry_days?: number
  inactivity_days?: number
  expiry_alert_days?: number[]
}

export interface CreateTierData {
  name: string
  min_spent: Decimal | number
  period_days: number
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
  upsertConfig(data: UpdateLoyaltyConfigData): Promise<LoyaltyConfig>

  // Tiers
  createTier(data: CreateTierData): Promise<LoyaltyTier>
  listTiers(): Promise<LoyaltyTier[]>

  // Account
  getAccountByCustomerId(customerId: string): Promise<LoyaltyAccount | null>
  createAccount(data: CreateAccountData): Promise<LoyaltyAccount>
  updateAccountBalance(
    accountId: string,
    pointsToAdd: number,
    cashbackToAdd: number,
    isEarned: boolean,
  ): Promise<LoyaltyAccount>
  updateAccountTier(accountId: string, newTierId: string): Promise<LoyaltyAccount>
  listInactiveAccounts(thresholdDate: Date): Promise<LoyaltyAccount[]>
  resetAccountInactivity(accountId: string, baseTierId: string): Promise<LoyaltyAccount>

  // Transactions
  createTransaction(
    data: AddTransactionData,
    balanceAfter: number,
  ): Promise<LoyaltyTransaction>
  listTransactionsByAccount(accountId: string): Promise<LoyaltyTransaction[]>
}

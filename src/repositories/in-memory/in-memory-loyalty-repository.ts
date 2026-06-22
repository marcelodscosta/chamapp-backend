import {
  ILoyaltyRepository,
  CreateTierData,
  CreateAccountData,
  AddTransactionData,
  UpdateLoyaltyConfigData,
} from '../interfaces/ILoyaltyRepository'
import {
  LoyaltyConfig,
  LoyaltyTier,
  LoyaltyAccount,
  LoyaltyTransaction,
} from '../../generated/prisma'
import { randomUUID } from 'node:crypto'
import { Decimal } from '../../generated/prisma/runtime/library'

export class InMemoryLoyaltyRepository implements ILoyaltyRepository {
  public config: LoyaltyConfig | null = null
  public tiers: LoyaltyTier[] = []
  public accounts: LoyaltyAccount[] = []
  public transactions: LoyaltyTransaction[] = []

  async getConfig(): Promise<LoyaltyConfig | null> {
    return this.config
  }

  async upsertConfig(data: UpdateLoyaltyConfigData): Promise<LoyaltyConfig> {
    if (this.config) {
      this.config = {
        ...this.config,
        ...data,
        updated_at: new Date(),
      } as LoyaltyConfig
      return this.config
    }

    this.config = {
      id: randomUUID(),
      program_enabled: data.program_enabled ?? true,
      program_mode: data.program_mode ?? 'POINTS',
      points_per_real: new Decimal(data.points_per_real ?? 10),
      conversion_rate: new Decimal(data.conversion_rate ?? 0.1),
      min_points_to_redeem: data.min_points_to_redeem ?? 500,
      max_redeem_percent: new Decimal(data.max_redeem_percent ?? 50),
      expiry_days: data.expiry_days ?? 365,
      inactivity_days: data.inactivity_days ?? 90,
      expiry_alert_days: data.expiry_alert_days ?? [15, 7],
      updated_at: new Date(),
    }

    return this.config
  }

  async createTier(data: CreateTierData): Promise<LoyaltyTier> {
    const tier: LoyaltyTier = {
      id: randomUUID(),
      name: data.name,
      min_points: data.min_points,
      multiplier: new Decimal(data.multiplier ?? 1),
      color_hex: data.color_hex ?? null,
      icon_url: data.icon_url ?? null,
      benefits: data.benefits ?? [],
      order: data.order ?? 0,
    }
    this.tiers.push(tier)
    return tier
  }

  async listTiers(): Promise<LoyaltyTier[]> {
    return this.tiers.sort((a, b) => a.order - b.order)
  }

  async findTierByPoints(points: number): Promise<LoyaltyTier | null> {
    const eligibleTiers = this.tiers.filter((t) => t.min_points <= points)
    if (eligibleTiers.length === 0) return null
    return eligibleTiers.sort((a, b) => b.min_points - a.min_points)[0]
  }

  async getAccountByCustomerId(
    customerId: string,
  ): Promise<LoyaltyAccount | null> {
    const account = this.accounts.find((a) => a.customerId === customerId)
    if (!account) return null
    const tier = this.tiers.find((t) => t.id === account.tierId)!
    return { ...account, tier } as unknown as LoyaltyAccount
  }

  async createAccount(data: CreateAccountData): Promise<LoyaltyAccount> {
    const account: LoyaltyAccount = {
      id: randomUUID(),
      customerId: data.customerId,
      tierId: data.tierId,
      balance_points: 0,
      balance_cashback: new Decimal(0),
      total_earned: 0,
      total_redeemed: 0,
      is_blocked: false,
      last_activity_at: new Date(),
      next_expiry_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    }
    this.accounts.push(account)
    const tier = this.tiers.find((t) => t.id === data.tierId)!
    return { ...account, tier } as unknown as LoyaltyAccount
  }

  async updateAccountBalance(
    accountId: string,
    pointsToAdd: number,
    cashbackToAdd: number,
    isEarned: boolean,
  ): Promise<LoyaltyAccount> {
    const index = this.accounts.findIndex((a) => a.id === accountId)
    if (index === -1) throw new Error('Account not found')

    const acc = this.accounts[index]
    acc.balance_points += pointsToAdd
    acc.balance_cashback = new Decimal(
      Number(acc.balance_cashback) + cashbackToAdd,
    )
    acc.last_activity_at = new Date()
    acc.updated_at = new Date()

    if (isEarned) {
      acc.total_earned += pointsToAdd
    } else {
      acc.total_redeemed += Math.abs(pointsToAdd)
    }

    const tier = this.tiers.find((t) => t.id === acc.tierId)!
    return { ...acc, tier } as unknown as LoyaltyAccount
  }

  async createTransaction(
    data: AddTransactionData,
    balanceAfter: number,
  ): Promise<LoyaltyTransaction> {
    const t: LoyaltyTransaction = {
      id: randomUUID(),
      accountId: data.accountId,
      orderId: data.orderId ?? null,
      type: data.type,
      points: data.points,
      cashback_amount: new Decimal(data.cashback_amount ?? 0),
      balance_after: balanceAfter,
      description: data.description,
      reason: null,
      performed_by: null,
      reversed_by: null,
      expires_at: null,
      created_at: new Date(),
    }
    this.transactions.push(t)
    return t
  }

  async listTransactionsByAccount(
    accountId: string,
  ): Promise<LoyaltyTransaction[]> {
    return this.transactions
      .filter((t) => t.accountId === accountId)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
  }

  async listInactiveAccounts(thresholdDate: Date): Promise<LoyaltyAccount[]> {
    return this.accounts.filter(
      (a) => a.last_activity_at < thresholdDate && (a.balance_points > 0 || Number(a.balance_cashback) > 0)
    )
  }

  async resetAccountInactivity(accountId: string, baseTierId: string): Promise<LoyaltyAccount> {
    const acc = this.accounts.find((a) => a.id === accountId)
    if (!acc) throw new Error('Not found')
    acc.balance_points = 0
    acc.balance_cashback = new Decimal(0)
    acc.tierId = baseTierId
    acc.last_activity_at = new Date()
    return acc
  }
}

import { prisma } from '../../lib/prisma'
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

export class PrismaLoyaltyRepository implements ILoyaltyRepository {
  async getConfig(): Promise<LoyaltyConfig | null> {
    return prisma.loyaltyConfig.findFirst()
  }

  async upsertConfig(data: UpdateLoyaltyConfigData): Promise<LoyaltyConfig> {
    const existing = await prisma.loyaltyConfig.findFirst()

    if (existing) {
      return prisma.loyaltyConfig.update({
        where: { id: existing.id },
        data,
      })
    }

    return prisma.loyaltyConfig.create({
      data: {
        program_enabled: data.program_enabled ?? true,
        program_mode: data.program_mode ?? 'POINTS',
        points_per_real: data.points_per_real ?? 10,
        conversion_rate: data.conversion_rate ?? 0.1,
        min_points_to_redeem: data.min_points_to_redeem ?? 500,
        max_redeem_percent: data.max_redeem_percent ?? 50,
        expiry_days: data.expiry_days ?? 365,
        inactivity_days: data.inactivity_days ?? 90,
      },
    })
  }

  async createTier(data: CreateTierData): Promise<LoyaltyTier> {
    return prisma.loyaltyTier.create({ data })
  }

  async listTiers(): Promise<LoyaltyTier[]> {
    return prisma.loyaltyTier.findMany({
      orderBy: { order: 'asc' },
    })
  }

  async findTierByPoints(points: number): Promise<LoyaltyTier | null> {
    return prisma.loyaltyTier.findFirst({
      where: {
        min_points: { lte: points },
      },
      orderBy: { min_points: 'desc' },
    })
  }

  async getAccountByCustomerId(
    customerId: string,
  ): Promise<LoyaltyAccount | null> {
    return prisma.loyaltyAccount.findUnique({
      where: { customerId },
      include: { tier: true },
    })
  }

  async createAccount(data: CreateAccountData): Promise<LoyaltyAccount> {
    return prisma.loyaltyAccount.create({
      data,
      include: { tier: true },
    })
  }

  async updateAccountBalance(
    accountId: string,
    pointsToAdd: number,
    cashbackToAdd: number,
    isEarned: boolean,
  ): Promise<LoyaltyAccount> {
    const updateData: Record<string, unknown> = {
      balance_points: { increment: pointsToAdd },
      balance_cashback: { increment: cashbackToAdd },
      last_activity_at: new Date(),
    }

    if (isEarned) {
      updateData.total_earned = { increment: pointsToAdd }
    } else {
      updateData.total_redeemed = { increment: Math.abs(pointsToAdd) }
    }

    return prisma.loyaltyAccount.update({
      where: { id: accountId },
      data: updateData,
      include: { tier: true },
    })
  }

  async createTransaction(
    data: AddTransactionData,
    balanceAfter: number,
  ): Promise<LoyaltyTransaction> {
    return prisma.loyaltyTransaction.create({
      data: {
        ...data,
        balance_after: balanceAfter,
      },
    })
  }

  async listTransactionsByAccount(
    accountId: string,
  ): Promise<LoyaltyTransaction[]> {
    return prisma.loyaltyTransaction.findMany({
      where: { accountId },
      orderBy: { created_at: 'desc' },
    })
  }
}

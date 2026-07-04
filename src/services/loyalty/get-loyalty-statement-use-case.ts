import { prisma } from '../../lib/prisma'
import { LoyaltyTransaction } from '../../generated/prisma'

interface GetLoyaltyStatementUseCaseRequest {
  customerId: string
}

interface GetLoyaltyStatementUseCaseResponse {
  transactions: LoyaltyTransaction[]
  account: any
}

export class GetLoyaltyStatementUseCase {
  async execute({
    customerId,
  }: GetLoyaltyStatementUseCaseRequest): Promise<GetLoyaltyStatementUseCaseResponse> {
    const account = await prisma.loyaltyAccount.findUnique({
      where: { customerId },
      include: {
        tier: true,
      },
    })

    if (!account) {
      throw new Error('Conta de fidelidade não encontrada para este cliente.')
    }

    const transactions = await prisma.loyaltyTransaction.findMany({
      where: { accountId: account.id },
      orderBy: { created_at: 'desc' },
      include: {
        order: {
          select: { order_number: true },
        },
      },
    })

    return { transactions, account }
  }
}

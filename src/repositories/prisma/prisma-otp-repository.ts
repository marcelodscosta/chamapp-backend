import { prisma } from '../../lib/prisma'
import { IOtpRepository, CreateOtpData } from '../interfaces/IOtpRepository'
import { OtpCode } from '../../generated/prisma'

export class PrismaOtpRepository implements IOtpRepository {
  async create(data: CreateOtpData): Promise<OtpCode> {
    return prisma.otpCode.create({ data })
  }

  async findByEmailAndCode(email: string, code: string): Promise<OtpCode | null> {
    return prisma.otpCode.findFirst({
      where: {
        email,
        code,
        used: false,
      },
      orderBy: { created_at: 'desc' },
    })
  }

  async markAsUsed(id: string): Promise<void> {
    await prisma.otpCode.update({
      where: { id },
      data: { used: true },
    })
  }
}

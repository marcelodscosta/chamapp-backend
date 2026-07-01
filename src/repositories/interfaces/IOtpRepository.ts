import { OtpCode } from '../../generated/prisma'

export interface CreateOtpData {
  email: string
  code: string
  expires_at: Date
}

export interface IOtpRepository {
  create(data: CreateOtpData): Promise<OtpCode>
  findByEmailAndCode(email: string, code: string): Promise<OtpCode | null>
  markAsUsed(id: string): Promise<void>
}

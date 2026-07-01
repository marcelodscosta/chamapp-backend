import { IOtpRepository, CreateOtpData } from '../interfaces/IOtpRepository'
import { OtpCode } from '../../generated/prisma'
import { randomUUID } from 'crypto'

export class InMemoryOtpRepository implements IOtpRepository {
  public items: OtpCode[] = []

  async create(data: CreateOtpData): Promise<OtpCode> {
    const otp: OtpCode = {
      id: randomUUID(),
      email: data.email,
      code: data.code,
      expires_at: data.expires_at,
      used: false,
      created_at: new Date(),
    }
    this.items.push(otp)
    return otp
  }

  async findByEmailAndCode(email: string, code: string): Promise<OtpCode | null> {
    const otp = this.items.find(
      (item) => item.email === email && item.code === code && !item.used
    )
    return otp || null
  }

  async markAsUsed(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.items[index].used = true
    }
  }
}

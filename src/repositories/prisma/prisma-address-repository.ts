import { prisma } from '../../lib/prisma'
import {
  IAddressRepository,
  CreateAddressData,
  UpdateAddressData,
} from '../interfaces/IAddressRepository'
import { Address } from '../../generated/prisma'

export class PrismaAddressRepository implements IAddressRepository {
  async findById(id: string): Promise<Address | null> {
    return prisma.address.findUnique({ where: { id } })
  }

  async listByCustomer(customerId: string): Promise<Address[]> {
    return prisma.address.findMany({
      where: { customerId },
      orderBy: [{ is_default: 'desc' }, { created_at: 'desc' }],
    })
  }

  async create(data: CreateAddressData): Promise<Address> {
    if (data.is_default) {
      await prisma.address.updateMany({
        where: { customerId: data.customerId },
        data: { is_default: false },
      })
    }

    return prisma.address.create({ data })
  }

  async update(id: string, data: UpdateAddressData): Promise<Address> {
    return prisma.address.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.address.delete({
      where: { id },
    })
  }

  async setDefault(customerId: string, addressId: string): Promise<void> {
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { customerId },
        data: { is_default: false },
      }),
      prisma.address.update({
        where: { id: addressId },
        data: { is_default: true },
      }),
    ])
  }
}

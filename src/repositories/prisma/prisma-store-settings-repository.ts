import { prisma } from '../../lib/prisma'
import {
  IStoreSettingsRepository,
  UpdateStoreSettingsData,
} from '../interfaces/IStoreSettingsRepository'
import { StoreSettings } from '../../generated/prisma'

export class PrismaStoreSettingsRepository implements IStoreSettingsRepository {
  async getSettings(): Promise<StoreSettings | null> {
    return prisma.storeSettings.findFirst()
  }

  async upsertSettings(data: UpdateStoreSettingsData): Promise<StoreSettings> {
    const existing = await prisma.storeSettings.findFirst()

    if (existing) {
      return prisma.storeSettings.update({
        where: { id: existing.id },
        data: {
          ...data,
          name: data.name ?? existing.name, // Prisma não aceita null para name
        },
      })
    }

    return prisma.storeSettings.create({
      data: {
        name: data.name ?? 'Minha Loja',
        phone: data.phone,
        logo_url: data.logo_url,
        address: data.address,
        delivery_fee: data.delivery_fee ?? 0,
        free_delivery_above: data.free_delivery_above,
        min_order_value: data.min_order_value ?? 0,
        store_open: data.store_open ?? true,
        opening_time: data.opening_time,
        closing_time: data.closing_time,
        operating_days: data.operating_days ?? undefined,
        holidays: data.holidays ?? undefined,
      },
    })
  }
}

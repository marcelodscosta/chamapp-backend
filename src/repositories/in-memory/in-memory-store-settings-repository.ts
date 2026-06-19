import {
  IStoreSettingsRepository,
  UpdateStoreSettingsData,
} from '../interfaces/IStoreSettingsRepository'
import { StoreSettings } from '../../generated/prisma'
import { Decimal } from '../../generated/prisma/runtime/library'
import { randomUUID } from 'node:crypto'

export class InMemoryStoreSettingsRepository implements IStoreSettingsRepository {
  public settings: StoreSettings | null = null

  async getSettings(): Promise<StoreSettings | null> {
    return this.settings
  }

  async upsertSettings(data: UpdateStoreSettingsData): Promise<StoreSettings> {
    if (this.settings) {
      this.settings = {
        ...this.settings,
        ...data,
        delivery_fee:
          data.delivery_fee !== undefined
            ? new Decimal(data.delivery_fee)
            : this.settings.delivery_fee,
        free_delivery_above:
          data.free_delivery_above !== undefined
            ? data.free_delivery_above
              ? new Decimal(data.free_delivery_above)
              : null
            : this.settings.free_delivery_above,
        min_order_value:
          data.min_order_value !== undefined
            ? new Decimal(data.min_order_value)
            : this.settings.min_order_value,
        updated_at: new Date(),
      } as StoreSettings
      return this.settings
    }

    this.settings = {
      id: randomUUID(),
      name: data.name ?? 'Minha Loja',
      phone: data.phone ?? null,
      logo_url: data.logo_url ?? null,
      address: data.address ?? null,
      delivery_fee: new Decimal(data.delivery_fee ?? 0),
      free_delivery_above: data.free_delivery_above
        ? new Decimal(data.free_delivery_above)
        : null,
      min_order_value: new Decimal(data.min_order_value ?? 0),
      store_open: data.store_open ?? true,
      opening_time: data.opening_time ?? null,
      closing_time: data.closing_time ?? null,
      updated_at: new Date(),
    }

    return this.settings
  }
}

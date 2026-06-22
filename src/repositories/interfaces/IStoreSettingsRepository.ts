import { StoreSettings } from '../../generated/prisma'
import { Decimal } from '../../generated/prisma/runtime/library'

export interface UpdateStoreSettingsData {
  name?: string | null
  phone?: string | null
  logo_url?: string | null
  address?: string | null
  delivery_fee?: Decimal | number
  free_delivery_above?: Decimal | number | null
  min_order_value?: Decimal | number
  store_open?: boolean
  opening_time?: string | null
  closing_time?: string | null
  operating_days?: any
  holidays?: any
}

export interface IStoreSettingsRepository {
  getSettings(): Promise<StoreSettings | null>
  upsertSettings(data: UpdateStoreSettingsData): Promise<StoreSettings>
}

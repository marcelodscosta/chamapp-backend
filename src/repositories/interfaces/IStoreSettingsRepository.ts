import { StoreSettings } from '../../generated/prisma'
import { Decimal } from '../../generated/prisma/runtime/library'

export interface UpdateStoreSettingsData {
  name?: string
  phone?: string
  logo_url?: string
  address?: string
  delivery_fee?: Decimal | number
  free_delivery_above?: Decimal | number | null
  min_order_value?: Decimal | number
  store_open?: boolean
  opening_time?: string | null
  closing_time?: string | null
}

export interface IStoreSettingsRepository {
  getSettings(): Promise<StoreSettings | null>
  upsertSettings(data: UpdateStoreSettingsData): Promise<StoreSettings>
}

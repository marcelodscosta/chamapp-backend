import { StoreSettings } from '../../generated/prisma'
import { IStoreSettingsRepository } from '../../repositories/interfaces/IStoreSettingsRepository'

interface UpdateStoreSettingsRequest {
  name?: string
  phone?: string
  logo_url?: string
  address?: string
  delivery_fee?: number
  free_delivery_above?: number | null
  min_order_value?: number
  store_open?: boolean
  opening_time?: string | null
  closing_time?: string | null
}

interface UpdateStoreSettingsResponse {
  settings: StoreSettings
}

export class UpdateStoreSettingsUseCase {
  constructor(private storeSettingsRepository: IStoreSettingsRepository) {}

  async execute(
    data: UpdateStoreSettingsRequest,
  ): Promise<UpdateStoreSettingsResponse> {
    const settings = await this.storeSettingsRepository.upsertSettings(data)

    return { settings }
  }
}

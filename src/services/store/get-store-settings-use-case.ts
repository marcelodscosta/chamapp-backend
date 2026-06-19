import { StoreSettings } from '../../generated/prisma'
import { IStoreSettingsRepository } from '../../repositories/interfaces/IStoreSettingsRepository'

interface GetStoreSettingsResponse {
  settings: StoreSettings | null
}

export class GetStoreSettingsUseCase {
  constructor(private storeSettingsRepository: IStoreSettingsRepository) {}

  async execute(): Promise<GetStoreSettingsResponse> {
    const settings = await this.storeSettingsRepository.getSettings()

    return { settings }
  }
}

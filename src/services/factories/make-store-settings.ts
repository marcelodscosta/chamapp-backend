import { PrismaStoreSettingsRepository } from '../../repositories/prisma/prisma-store-settings-repository'
import { GetStoreSettingsUseCase } from '../store/get-store-settings-use-case'
import { UpdateStoreSettingsUseCase } from '../store/update-store-settings-use-case'

export function makeGetStoreSettings() {
  const repository = new PrismaStoreSettingsRepository()
  return new GetStoreSettingsUseCase(repository)
}

export function makeUpdateStoreSettings() {
  const repository = new PrismaStoreSettingsRepository()
  return new UpdateStoreSettingsUseCase(repository)
}

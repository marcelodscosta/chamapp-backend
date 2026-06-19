import { describe, it, expect, beforeEach } from 'vitest'
import { GetStoreSettingsUseCase } from './get-store-settings-use-case'
import { InMemoryStoreSettingsRepository } from '../../repositories/in-memory/in-memory-store-settings-repository'

let storeSettingsRepository: InMemoryStoreSettingsRepository
let sut: GetStoreSettingsUseCase

describe('GetStoreSettingsUseCase', () => {
  beforeEach(() => {
    storeSettingsRepository = new InMemoryStoreSettingsRepository()
    sut = new GetStoreSettingsUseCase(storeSettingsRepository)
  })

  it('deve retornar as configurações da loja caso existam', async () => {
    await storeSettingsRepository.upsertSettings({
      name: 'Loja Teste',
      store_open: false,
    })

    const { settings } = await sut.execute()

    expect(settings?.name).toBe('Loja Teste')
    expect(settings?.store_open).toBe(false)
  })

  it('deve retornar null se não houver configurações', async () => {
    const { settings } = await sut.execute()
    expect(settings).toBeNull()
  })
})

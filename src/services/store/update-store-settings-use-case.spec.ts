import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateStoreSettingsUseCase } from './update-store-settings-use-case'
import { InMemoryStoreSettingsRepository } from '../../repositories/in-memory/in-memory-store-settings-repository'

let storeSettingsRepository: InMemoryStoreSettingsRepository
let sut: UpdateStoreSettingsUseCase

describe('UpdateStoreSettingsUseCase', () => {
  beforeEach(() => {
    storeSettingsRepository = new InMemoryStoreSettingsRepository()
    sut = new UpdateStoreSettingsUseCase(storeSettingsRepository)
  })

  it('deve criar configurações se não existirem', async () => {
    const { settings } = await sut.execute({
      name: 'Loja Nova',
      delivery_fee: 5.5,
    })

    expect(settings.id).toBeDefined()
    expect(settings.name).toBe('Loja Nova')
    expect(Number(settings.delivery_fee)).toBe(5.5)
  })

  it('deve atualizar configurações existentes', async () => {
    await sut.execute({
      name: 'Loja Nova',
      store_open: true,
    })

    const { settings } = await sut.execute({
      store_open: false,
    })

    expect(settings.name).toBe('Loja Nova')
    expect(settings.store_open).toBe(false)
  })
})

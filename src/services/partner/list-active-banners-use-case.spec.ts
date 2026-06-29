import { describe, it, expect, beforeEach } from 'vitest'
import { ListActiveBannersUseCase } from './list-active-banners-use-case'
import { InMemoryPartnerRepository } from '../../repositories/in-memory/in-memory-partner-repository'

let partnerRepository: InMemoryPartnerRepository
let sut: ListActiveBannersUseCase

describe('ListActiveBannersUseCase', () => {
  beforeEach(() => {
    partnerRepository = new InMemoryPartnerRepository()
    sut = new ListActiveBannersUseCase(partnerRepository)
  })

  it('deve listar apenas banners ativos e dentro da data de validade', async () => {
    const partner = await partnerRepository.createPartner({ name: 'Parceiro' })

    // Banner Ativo
    await partnerRepository.createBanner({
      partnerId: partner.id,
      image_url: 'https://images.com/active.png',
      target_type: 'EXTERNAL_LINK',
      priority: 1,
    })

    // Banner Inativo
    const inactiveBanner = await partnerRepository.createBanner({
      partnerId: partner.id,
      image_url: 'https://images.com/inactive.png',
      target_type: 'EXTERNAL_LINK',
      priority: 2,
    })
    await partnerRepository.updateBanner(inactiveBanner.id, { is_active: false })

    // Banner Expirado (no passado)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    await partnerRepository.createBanner({
      partnerId: partner.id,
      image_url: 'https://images.com/expired.png',
      target_type: 'EXTERNAL_LINK',
      priority: 3,
      expires_at: yesterday,
    })

    // Banner com validade futura
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 2)
    await partnerRepository.createBanner({
      partnerId: partner.id,
      image_url: 'https://images.com/valid-future.png',
      target_type: 'EXTERNAL_LINK',
      priority: 0,
      expires_at: tomorrow,
    })

    const { banners } = await sut.execute()

    expect(banners).toHaveLength(2)
    expect(banners[0].image_url).toBe('https://images.com/valid-future.png') // Prioridade 0 vem antes
    expect(banners[1].image_url).toBe('https://images.com/active.png') // Prioridade 1
  })
})

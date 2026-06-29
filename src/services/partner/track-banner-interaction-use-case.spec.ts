import { describe, it, expect, beforeEach } from 'vitest'
import { TrackBannerInteractionUseCase } from './track-banner-interaction-use-case'
import { InMemoryPartnerRepository } from '../../repositories/in-memory/in-memory-partner-repository'

let partnerRepository: InMemoryPartnerRepository
let sut: TrackBannerInteractionUseCase

describe('TrackBannerInteractionUseCase', () => {
  beforeEach(() => {
    partnerRepository = new InMemoryPartnerRepository()
    sut = new TrackBannerInteractionUseCase(partnerRepository)
  })

  it('deve incrementar visualizações de um banner', async () => {
    const partner = await partnerRepository.createPartner({ name: 'Parceiro' })
    const banner = await partnerRepository.createBanner({
      partnerId: partner.id,
      image_url: 'https://images.com/banner.png',
      target_type: 'EXTERNAL_LINK',
    })

    await sut.execute({ id: banner.id, interaction: 'VIEW' })

    const updated = await partnerRepository.findBannerById(banner.id)
    expect(updated?.views_count).toBe(1)
    expect(updated?.clicks_count).toBe(0)
  })

  it('deve incrementar cliques de um banner', async () => {
    const partner = await partnerRepository.createPartner({ name: 'Parceiro' })
    const banner = await partnerRepository.createBanner({
      partnerId: partner.id,
      image_url: 'https://images.com/banner.png',
      target_type: 'EXTERNAL_LINK',
    })

    await sut.execute({ id: banner.id, interaction: 'CLICK' })

    const updated = await partnerRepository.findBannerById(banner.id)
    expect(updated?.views_count).toBe(0)
    expect(updated?.clicks_count).toBe(1)
  })

  it('deve lançar erro 404 se banner não existir', async () => {
    await expect(
      sut.execute({ id: 'non-existing-banner-id', interaction: 'CLICK' }),
    ).rejects.toMatchObject({ statusCode: 404 })
  })
})

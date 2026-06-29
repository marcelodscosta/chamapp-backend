import { describe, it, expect, beforeEach } from 'vitest'
import { CreateBannerUseCase } from './create-banner-use-case'
import { InMemoryPartnerRepository } from '../../repositories/in-memory/in-memory-partner-repository'

let partnerRepository: InMemoryPartnerRepository
let sut: CreateBannerUseCase

describe('CreateBannerUseCase', () => {
  beforeEach(() => {
    partnerRepository = new InMemoryPartnerRepository()
    sut = new CreateBannerUseCase(partnerRepository)
  })

  it('deve criar um banner de anúncio para um parceiro existente', async () => {
    const partner = await partnerRepository.createPartner({
      name: 'Supermercado de Teste',
    })

    const { banner } = await sut.execute({
      partnerId: partner.id,
      image_url: 'https://images.com/banner.png',
      target_type: 'EXTERNAL_LINK',
      target_url: 'https://supermercado.com',
      priority: 1,
    })

    expect(banner.id).toBeDefined()
    expect(banner.partnerId).toBe(partner.id)
    expect(banner.image_url).toBe('https://images.com/banner.png')
  })

  it('deve lançar erro 404 se tentar criar banner para parceiro inexistente', async () => {
    await expect(
      sut.execute({
        partnerId: 'non-existing-partner-uuid',
        image_url: 'https://images.com/banner.png',
        target_type: 'EXTERNAL_LINK',
      }),
    ).rejects.toMatchObject({ statusCode: 404 })
  })

  it('deve lançar erro 400 se a URL da imagem for vazia', async () => {
    const partner = await partnerRepository.createPartner({
      name: 'Supermercado de Teste',
    })

    await expect(
      sut.execute({
        partnerId: partner.id,
        image_url: '   ',
        target_type: 'EXTERNAL_LINK',
      }),
    ).rejects.toMatchObject({ statusCode: 400 })
  })
})

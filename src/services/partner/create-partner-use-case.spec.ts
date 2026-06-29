import { describe, it, expect, beforeEach } from 'vitest'
import { CreatePartnerUseCase } from './create-partner-use-case'
import { InMemoryPartnerRepository } from '../../repositories/in-memory/in-memory-partner-repository'

let partnerRepository: InMemoryPartnerRepository
let sut: CreatePartnerUseCase

describe('CreatePartnerUseCase', () => {
  beforeEach(() => {
    partnerRepository = new InMemoryPartnerRepository()
    sut = new CreatePartnerUseCase(partnerRepository)
  })

  it('deve cadastrar um novo parceiro comercial', async () => {
    const { partner } = await sut.execute({
      name: 'Farmácia de Teste',
      description: 'Medicamentos com desconto',
      phone: '74999999999',
      website: 'https://farmacia.com',
    })

    expect(partner.id).toBeDefined()
    expect(partner.name).toBe('Farmácia de Teste')
    expect(partner.is_active).toBe(true)
  })

  it('deve lançar erro 400 se o nome do parceiro estiver vazio', async () => {
    await expect(
      sut.execute({
        name: '   ',
      }),
    ).rejects.toMatchObject({ statusCode: 400 })
  })
})

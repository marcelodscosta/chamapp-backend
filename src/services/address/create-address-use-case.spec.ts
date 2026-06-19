import { describe, it, expect, beforeEach } from 'vitest'
import { CreateAddressUseCase } from './create-address-use-case'
import { InMemoryAddressRepository } from '../../repositories/in-memory/in-memory-address-repository'

let addressRepository: InMemoryAddressRepository
let sut: CreateAddressUseCase

describe('CreateAddressUseCase', () => {
  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository()
    sut = new CreateAddressUseCase(addressRepository)
  })

  it('deve criar um novo endereço e marcá-lo como padrão por ser o primeiro', async () => {
    const { address } = await sut.execute({
      customerId: 'user-1',
      label: 'Casa',
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zip_code: '01000-000',
    })

    expect(address.id).toBeDefined()
    expect(address.is_default).toBe(true)
  })
})

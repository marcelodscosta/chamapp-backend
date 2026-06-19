import { describe, it, expect, beforeEach } from 'vitest'
import { SetDefaultAddressUseCase } from './set-default-address-use-case'
import { InMemoryAddressRepository } from '../../repositories/in-memory/in-memory-address-repository'

let addressRepository: InMemoryAddressRepository
let sut: SetDefaultAddressUseCase

describe('SetDefaultAddressUseCase', () => {
  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository()
    sut = new SetDefaultAddressUseCase(addressRepository)
  })

  it('deve alterar o endereço padrão do cliente', async () => {
    const addr1 = await addressRepository.create({
      customerId: 'user-1',
      street: 'Rua A',
      number: '1',
      neighborhood: 'B',
      city: 'C',
      state: 'SP',
      zip_code: '123',
    }) // este vai ser o padrão

    const addr2 = await addressRepository.create({
      customerId: 'user-1',
      street: 'Rua B',
      number: '2',
      neighborhood: 'B',
      city: 'C',
      state: 'SP',
      zip_code: '123',
    }) // este NÃO é padrão

    await sut.execute({
      addressId: addr2.id,
      customerId: 'user-1',
    })

    const found1 = await addressRepository.findById(addr1.id)
    const found2 = await addressRepository.findById(addr2.id)

    expect(found1?.is_default).toBe(false)
    expect(found2?.is_default).toBe(true)
  })
})

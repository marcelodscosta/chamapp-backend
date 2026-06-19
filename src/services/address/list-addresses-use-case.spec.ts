import { describe, it, expect, beforeEach } from 'vitest'
import { ListAddressesUseCase } from './list-addresses-use-case'
import { InMemoryAddressRepository } from '../../repositories/in-memory/in-memory-address-repository'

let addressRepository: InMemoryAddressRepository
let sut: ListAddressesUseCase

describe('ListAddressesUseCase', () => {
  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository()
    sut = new ListAddressesUseCase(addressRepository)
  })

  it('deve listar os endereços de um cliente com o padrão primeiro', async () => {
    await addressRepository.create({
      customerId: 'user-1',
      street: 'Rua 1',
      number: '1',
      neighborhood: 'B',
      city: 'C',
      state: 'SP',
      zip_code: '123',
    })

    await addressRepository.create({
      customerId: 'user-1',
      street: 'Rua 2',
      number: '2',
      neighborhood: 'B',
      city: 'C',
      state: 'SP',
      zip_code: '123',
      is_default: true,
    })

    const { addresses } = await sut.execute({ customerId: 'user-1' })

    expect(addresses).toHaveLength(2)
    expect(addresses[0].street).toBe('Rua 2') // is_default = true
  })
})

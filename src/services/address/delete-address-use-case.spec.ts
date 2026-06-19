import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteAddressUseCase } from './delete-address-use-case'
import { InMemoryAddressRepository } from '../../repositories/in-memory/in-memory-address-repository'
import { AppError } from '../errors/app-error'

let addressRepository: InMemoryAddressRepository
let sut: DeleteAddressUseCase

describe('DeleteAddressUseCase', () => {
  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository()
    sut = new DeleteAddressUseCase(addressRepository)
  })

  it('deve deletar um endereço do cliente', async () => {
    const address = await addressRepository.create({
      customerId: 'user-1',
      street: 'Rua A',
      number: '1',
      neighborhood: 'B',
      city: 'C',
      state: 'SP',
      zip_code: '123',
    })

    await sut.execute({
      addressId: address.id,
      customerId: 'user-1',
    })

    const found = await addressRepository.findById(address.id)
    expect(found).toBeNull()
  })
})

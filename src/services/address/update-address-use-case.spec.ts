import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateAddressUseCase } from './update-address-use-case'
import { InMemoryAddressRepository } from '../../repositories/in-memory/in-memory-address-repository'
import { AppError } from '../errors/app-error'

let addressRepository: InMemoryAddressRepository
let sut: UpdateAddressUseCase

describe('UpdateAddressUseCase', () => {
  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository()
    sut = new UpdateAddressUseCase(addressRepository)
  })

  it('deve atualizar um endereço existente do cliente', async () => {
    const address = await addressRepository.create({
      customerId: 'user-1',
      street: 'Rua A',
      number: '1',
      neighborhood: 'B',
      city: 'C',
      state: 'SP',
      zip_code: '123',
    })

    const response = await sut.execute({
      addressId: address.id,
      customerId: 'user-1',
      number: '2',
    })

    expect(response.address.number).toBe('2')
  })

  it('não deve atualizar um endereço de outro cliente', async () => {
    const address = await addressRepository.create({
      customerId: 'user-2',
      street: 'Rua A',
      number: '1',
      neighborhood: 'B',
      city: 'C',
      state: 'SP',
      zip_code: '123',
    })

    await expect(
      sut.execute({
        addressId: address.id,
        customerId: 'user-1',
        number: '2',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})

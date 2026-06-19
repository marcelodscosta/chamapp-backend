import { Address } from '../../generated/prisma'
import { IAddressRepository } from '../../repositories/interfaces/IAddressRepository'

interface CreateAddressRequest {
  customerId: string
  label?: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  reference?: string
  is_default?: boolean
}

interface CreateAddressResponse {
  address: Address
}

export class CreateAddressUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute(data: CreateAddressRequest): Promise<CreateAddressResponse> {
    const address = await this.addressRepository.create(data)

    return { address }
  }
}

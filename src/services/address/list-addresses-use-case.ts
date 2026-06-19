import { Address } from '../../generated/prisma'
import { IAddressRepository } from '../../repositories/interfaces/IAddressRepository'

interface ListAddressesRequest {
  customerId: string
}

interface ListAddressesResponse {
  addresses: Address[]
}

export class ListAddressesUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute({
    customerId,
  }: ListAddressesRequest): Promise<ListAddressesResponse> {
    const addresses = await this.addressRepository.listByCustomer(customerId)

    return { addresses }
  }
}

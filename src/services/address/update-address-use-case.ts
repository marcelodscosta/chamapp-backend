import { Address } from '../../generated/prisma'
import { IAddressRepository } from '../../repositories/interfaces/IAddressRepository'
import { AppError } from '../errors/app-error'

interface UpdateAddressRequest {
  addressId: string
  customerId: string
  label?: string
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  zip_code?: string
  reference?: string
}

interface UpdateAddressResponse {
  address: Address
}

export class UpdateAddressUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute({
    addressId,
    customerId,
    ...data
  }: UpdateAddressRequest): Promise<UpdateAddressResponse> {
    const address = await this.addressRepository.findById(addressId)

    if (!address) {
      throw new AppError('Endereço não encontrado.', 404)
    }

    if (address.customerId !== customerId) {
      throw new AppError('Acesso não autorizado.', 403)
    }

    const updatedAddress = await this.addressRepository.update(addressId, data)

    return { address: updatedAddress }
  }
}

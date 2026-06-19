import { IAddressRepository } from '../../repositories/interfaces/IAddressRepository'
import { AppError } from '../errors/app-error'

interface SetDefaultAddressRequest {
  addressId: string
  customerId: string
}

export class SetDefaultAddressUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute({
    addressId,
    customerId,
  }: SetDefaultAddressRequest): Promise<void> {
    const address = await this.addressRepository.findById(addressId)

    if (!address) {
      throw new AppError('Endereço não encontrado.', 404)
    }

    if (address.customerId !== customerId) {
      throw new AppError('Acesso não autorizado.', 403)
    }

    await this.addressRepository.setDefault(customerId, addressId)
  }
}

import { IAddressRepository } from '../../repositories/interfaces/IAddressRepository'
import { AppError } from '../errors/app-error'

interface DeleteAddressRequest {
  addressId: string
  customerId: string
}

export class DeleteAddressUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute({
    addressId,
    customerId,
  }: DeleteAddressRequest): Promise<void> {
    const address = await this.addressRepository.findById(addressId)

    if (!address) {
      throw new AppError('Endereço não encontrado.', 404)
    }

    if (address.customerId !== customerId) {
      throw new AppError('Acesso não autorizado.', 403)
    }

    await this.addressRepository.delete(addressId)
  }
}

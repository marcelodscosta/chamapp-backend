import { PrismaAddressRepository } from '../../repositories/prisma/prisma-address-repository'
import { ListAddressesUseCase } from '../address/list-addresses-use-case'

export function makeListAddresses() {
  const repository = new PrismaAddressRepository()
  return new ListAddressesUseCase(repository)
}

import { PrismaAddressRepository } from '../../repositories/prisma/prisma-address-repository'
import { SetDefaultAddressUseCase } from '../address/set-default-address-use-case'

export function makeSetDefaultAddress() {
  const repository = new PrismaAddressRepository()
  return new SetDefaultAddressUseCase(repository)
}

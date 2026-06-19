import { PrismaAddressRepository } from '../../repositories/prisma/prisma-address-repository'
import { DeleteAddressUseCase } from '../address/delete-address-use-case'

export function makeDeleteAddress() {
  const repository = new PrismaAddressRepository()
  return new DeleteAddressUseCase(repository)
}

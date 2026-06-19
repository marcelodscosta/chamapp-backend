import { PrismaAddressRepository } from '../../repositories/prisma/prisma-address-repository'
import { UpdateAddressUseCase } from '../address/update-address-use-case'

export function makeUpdateAddress() {
  const repository = new PrismaAddressRepository()
  return new UpdateAddressUseCase(repository)
}

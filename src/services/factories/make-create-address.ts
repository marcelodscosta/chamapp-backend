import { PrismaAddressRepository } from '../../repositories/prisma/prisma-address-repository'
import { CreateAddressUseCase } from '../address/create-address-use-case'

export function makeCreateAddress() {
  const repository = new PrismaAddressRepository()
  return new CreateAddressUseCase(repository)
}

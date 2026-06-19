import { PrismaProductRepository } from '../../repositories/prisma/prisma-product-repository'
import { ToggleProductAvailabilityUseCase } from '../catalog/toggle-product-availability-use-case'

export function makeToggleProductAvailability() {
  const repository = new PrismaProductRepository()
  return new ToggleProductAvailabilityUseCase(repository)
}

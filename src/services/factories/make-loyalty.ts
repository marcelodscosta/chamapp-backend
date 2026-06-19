import { PrismaLoyaltyRepository } from '../../repositories/prisma/prisma-loyalty-repository'
import { GetLoyaltyConfigUseCase } from '../loyalty/get-loyalty-config-use-case'
import { UpdateLoyaltyConfigUseCase } from '../loyalty/update-loyalty-config-use-case'
import { CreateLoyaltyTierUseCase } from '../loyalty/create-loyalty-tier-use-case'
import { GetLoyaltyAccountUseCase } from '../loyalty/get-loyalty-account-use-case'

export function makeGetLoyaltyConfig() {
  return new GetLoyaltyConfigUseCase(new PrismaLoyaltyRepository())
}

export function makeUpdateLoyaltyConfig() {
  return new UpdateLoyaltyConfigUseCase(new PrismaLoyaltyRepository())
}

export function makeCreateLoyaltyTier() {
  return new CreateLoyaltyTierUseCase(new PrismaLoyaltyRepository())
}

export function makeGetLoyaltyAccount() {
  return new GetLoyaltyAccountUseCase(new PrismaLoyaltyRepository())
}

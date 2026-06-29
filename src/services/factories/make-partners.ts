import { PrismaPartnerRepository } from '../../repositories/prisma/prisma-partner-repository'
import { CreatePartnerUseCase } from '../partner/create-partner-use-case'
import { ListPartnersUseCase } from '../partner/list-partners-use-case'
import { UpdatePartnerUseCase } from '../partner/update-partner-use-case'
import { DeletePartnerUseCase } from '../partner/delete-partner-use-case'
import { CreateBannerUseCase } from '../partner/create-banner-use-case'
import { ListBannersUseCase } from '../partner/list-banners-use-case'
import { ListActiveBannersUseCase } from '../partner/list-active-banners-use-case'
import { UpdateBannerUseCase } from '../partner/update-banner-use-case'
import { DeleteBannerUseCase } from '../partner/delete-banner-use-case'
import { TrackBannerInteractionUseCase } from '../partner/track-banner-interaction-use-case'
import { GetPartnerUseCase } from '../partner/get-partner-use-case'
import { UploadPartnerLogoUseCase } from '../partner/upload-partner-logo-use-case'
import { UploadBannerImageUseCase } from '../partner/upload-banner-image-use-case'
import { S3StorageProvider } from '../../providers/StorageProvider/S3StorageProvider'



export function makeCreatePartner() {
  const repository = new PrismaPartnerRepository()
  return new CreatePartnerUseCase(repository)
}

export function makeListPartners() {
  const repository = new PrismaPartnerRepository()
  return new ListPartnersUseCase(repository)
}

export function makeUpdatePartner() {
  const repository = new PrismaPartnerRepository()
  return new UpdatePartnerUseCase(repository)
}

export function makeDeletePartner() {
  const repository = new PrismaPartnerRepository()
  return new DeletePartnerUseCase(repository)
}

export function makeCreateBanner() {
  const repository = new PrismaPartnerRepository()
  return new CreateBannerUseCase(repository)
}

export function makeListBanners() {
  const repository = new PrismaPartnerRepository()
  return new ListBannersUseCase(repository)
}

export function makeListActiveBanners() {
  const repository = new PrismaPartnerRepository()
  return new ListActiveBannersUseCase(repository)
}

export function makeUpdateBanner() {
  const repository = new PrismaPartnerRepository()
  return new UpdateBannerUseCase(repository)
}

export function makeDeleteBanner() {
  const repository = new PrismaPartnerRepository()
  return new DeleteBannerUseCase(repository)
}

export function makeTrackBannerInteraction() {
  const repository = new PrismaPartnerRepository()
  return new TrackBannerInteractionUseCase(repository)
}

export function makeGetPartner() {
  const repository = new PrismaPartnerRepository()
  return new GetPartnerUseCase(repository)
}

export function makeUploadPartnerLogo() {
  const repository = new PrismaPartnerRepository()
  const storageProvider = new S3StorageProvider()
  return new UploadPartnerLogoUseCase(repository, storageProvider)
}

export function makeUploadBannerImage() {
  const repository = new PrismaPartnerRepository()
  const storageProvider = new S3StorageProvider()
  return new UploadBannerImageUseCase(repository, storageProvider)
}



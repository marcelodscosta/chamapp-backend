import { Partner, PartnerBanner, BannerTargetType } from '../../generated/prisma'

export interface CreatePartnerData {
  name: string
  logo_url?: string
  description?: string
  phone?: string
  address?: string
  website?: string
}

export interface UpdatePartnerData {
  name?: string
  logo_url?: string
  description?: string
  phone?: string
  address?: string
  website?: string
  is_active?: boolean
}

export interface CreateBannerData {
  partnerId: string
  image_url: string
  target_type: BannerTargetType
  target_url?: string
  priority?: number
  expires_at?: Date | string
  show_on_home?: boolean
}

export interface UpdateBannerData {
  image_url?: string
  target_type?: BannerTargetType
  target_url?: string
  priority?: number
  is_active?: boolean
  expires_at?: Date | string | null
  show_on_home?: boolean
}

export interface IPartnerRepository {
  // --- CRUD Parceiros ---
  findPartnerById(id: string): Promise<Partner | null>
  listAllPartners(): Promise<Partner[]>
  createPartner(data: CreatePartnerData): Promise<Partner>
  updatePartner(id: string, data: UpdatePartnerData): Promise<Partner>
  deletePartner(id: string): Promise<void>

  // --- Banners ---
  findBannerById(id: string): Promise<PartnerBanner | null>
  listActiveBanners(): Promise<PartnerBanner[]>
  listAllBanners(): Promise<PartnerBanner[]>
  createBanner(data: CreateBannerData): Promise<PartnerBanner>
  updateBanner(id: string, data: UpdateBannerData): Promise<PartnerBanner>
  deleteBanner(id: string): Promise<void>
  incrementBannerViews(id: string): Promise<void>
  incrementBannerClicks(id: string): Promise<void>
}

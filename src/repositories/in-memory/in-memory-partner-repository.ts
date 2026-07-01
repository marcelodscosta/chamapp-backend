import {
  IPartnerRepository,
  CreatePartnerData,
  UpdatePartnerData,
  CreateBannerData,
  UpdateBannerData,
} from '../interfaces/IPartnerRepository'
import { Partner, PartnerBanner, BannerTargetType } from '../../generated/prisma'
import { randomUUID } from 'node:crypto'

export class InMemoryPartnerRepository implements IPartnerRepository {
  public partners: Partner[] = []
  public banners: PartnerBanner[] = []

  // --- CRUD Parceiros ---
  async findPartnerById(id: string): Promise<Partner | null> {
    return this.partners.find((p) => p.id === id) ?? null
  }

  async listAllPartners(): Promise<Partner[]> {
    return [...this.partners].sort((a, b) => a.name.localeCompare(b.name))
  }

  async createPartner(data: CreatePartnerData): Promise<Partner> {
    const partner: Partner = {
      id: randomUUID(),
      name: data.name,
      logo_url: data.logo_url ?? null,
      description: data.description ?? null,
      phone: data.phone ?? null,
      address: data.address ?? null,
      website: data.website ?? null,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    }
    this.partners.push(partner)
    return partner
  }

  async updatePartner(id: string, data: UpdatePartnerData): Promise<Partner> {
    const index = this.partners.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Parceiro não encontrado.')

    this.partners[index] = {
      ...this.partners[index],
      ...data,
      updated_at: new Date(),
    } as Partner
    return this.partners[index]
  }

  async deletePartner(id: string): Promise<void> {
    this.partners = this.partners.filter((p) => p.id !== id)
    this.banners = this.banners.filter((b) => b.partnerId !== id)
  }

  // --- Banners ---
  async findBannerById(id: string): Promise<PartnerBanner | null> {
    const banner = this.banners.find((b) => b.id === id)
    if (!banner) return null

    const partner = this.partners.find((p) => p.id === banner.partnerId)
    return {
      ...banner,
      partner,
    } as any
  }

  async listActiveBanners(): Promise<PartnerBanner[]> {
    const now = new Date()
    const activeBanners = this.banners.filter((b) => {
      const isExpired = b.expires_at && new Date(b.expires_at) < now
      return b.is_active && !isExpired
    })

    return activeBanners
      .sort((a, b) => a.priority - b.priority)
      .map((banner) => {
        const partner = this.partners.find((p) => p.id === banner.partnerId)
        return {
          ...banner,
          partner,
        } as any
      })
  }

  async listAllBanners(): Promise<PartnerBanner[]> {
    return [...this.banners]
      .sort((a, b) => a.priority - b.priority)
      .map((banner) => {
        const partner = this.partners.find((p) => p.id === banner.partnerId)
        return {
          ...banner,
          partner,
        } as any
      })
  }

  async createBanner(data: CreateBannerData): Promise<PartnerBanner> {
    const banner: PartnerBanner = {
      id: randomUUID(),
      partnerId: data.partnerId,
      image_url: data.image_url,
      target_type: data.target_type,
      target_url: data.target_url ?? null,
      priority: data.priority ?? 0,
      views_count: 0,
      clicks_count: 0,
      show_on_home: data.show_on_home ?? false,
      is_active: true,
      expires_at: data.expires_at ? new Date(data.expires_at) : null,
      created_at: new Date(),
    }
    this.banners.push(banner)
    return banner
  }

  async updateBanner(id: string, data: UpdateBannerData): Promise<PartnerBanner> {
    const index = this.banners.findIndex((b) => b.id === id)
    if (index === -1) throw new Error('Banner não encontrado.')

    this.banners[index] = {
      ...this.banners[index],
      image_url: data.image_url !== undefined ? data.image_url : this.banners[index].image_url,
      target_type: data.target_type !== undefined ? data.target_type : this.banners[index].target_type,
      target_url: data.target_url !== undefined ? data.target_url : this.banners[index].target_url,
      priority: data.priority !== undefined ? data.priority : this.banners[index].priority,
      is_active: data.is_active !== undefined ? data.is_active : this.banners[index].is_active,
      expires_at: data.expires_at === null ? null : data.expires_at !== undefined ? new Date(data.expires_at) : this.banners[index].expires_at,
    }
    return this.banners[index]
  }

  async deleteBanner(id: string): Promise<void> {
    this.banners = this.banners.filter((b) => b.id !== id)
  }

  async incrementBannerViews(id: string): Promise<void> {
    const index = this.banners.findIndex((b) => b.id === id)
    if (index !== -1) {
      this.banners[index].views_count += 1
    }
  }

  async incrementBannerClicks(id: string): Promise<void> {
    const index = this.banners.findIndex((b) => b.id === id)
    if (index !== -1) {
      this.banners[index].clicks_count += 1
    }
  }
}

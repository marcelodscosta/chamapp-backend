import { prisma } from '../../lib/prisma'
import {
  IPartnerRepository,
  CreatePartnerData,
  UpdatePartnerData,
  CreateBannerData,
  UpdateBannerData,
} from '../interfaces/IPartnerRepository'
import { Partner, PartnerBanner } from '../../generated/prisma'

export class PrismaPartnerRepository implements IPartnerRepository {
  // --- CRUD Parceiros ---
  async findPartnerById(id: string): Promise<Partner | null> {
    return prisma.partner.findUnique({
      where: { id },
      include: {
        banners: {
          where: {
            is_active: true,
            OR: [
              { expires_at: null },
              { expires_at: { gte: new Date() } }
            ]
          },
          orderBy: { priority: 'asc' },
        },
      },
    })
  }

  async listAllPartners(): Promise<Partner[]> {
    return prisma.partner.findMany({
      orderBy: { name: 'asc' },
    })
  }

  async createPartner(data: CreatePartnerData): Promise<Partner> {
    return prisma.partner.create({ data })
  }

  async updatePartner(id: string, data: UpdatePartnerData): Promise<Partner> {
    return prisma.partner.update({
      where: { id },
      data,
    })
  }

  async deletePartner(id: string): Promise<void> {
    await prisma.partner.delete({ where: { id } })
  }

  // --- Banners ---
  async findBannerById(id: string): Promise<PartnerBanner | null> {
    return prisma.partnerBanner.findUnique({
      where: { id },
      include: { partner: true },
    })
  }

  async listActiveBanners(): Promise<PartnerBanner[]> {
    const now = new Date()
    return prisma.partnerBanner.findMany({
      where: {
        is_active: true,
        show_on_home: true,
        OR: [
          { expires_at: null },
          { expires_at: { gte: now } }
        ]
      },
      orderBy: { priority: 'asc' },
      include: { partner: true },
    })
  }

  async listAllBanners(): Promise<PartnerBanner[]> {
    return prisma.partnerBanner.findMany({
      orderBy: { priority: 'asc' },
      include: { partner: true },
    })
  }

  async createBanner(data: CreateBannerData): Promise<PartnerBanner> {
    return prisma.partnerBanner.create({
      data: {
        partnerId: data.partnerId,
        image_url: data.image_url,
        target_type: data.target_type,
        target_url: data.target_url,
        priority: data.priority,
        show_on_home: data.show_on_home ?? false,
        expires_at: data.expires_at ? new Date(data.expires_at) : null,
      },
    })
  }

  async updateBanner(id: string, data: UpdateBannerData): Promise<PartnerBanner> {
    return prisma.partnerBanner.update({
      where: { id },
      data: {
        image_url: data.image_url,
        target_type: data.target_type,
        target_url: data.target_url,
        priority: data.priority,
        is_active: data.is_active,
        show_on_home: data.show_on_home,
        expires_at: data.expires_at === null ? null : data.expires_at ? new Date(data.expires_at) : undefined,
      },
    })
  }

  async deleteBanner(id: string): Promise<void> {
    await prisma.partnerBanner.delete({ where: { id } })
  }

  async incrementBannerViews(id: string): Promise<void> {
    await prisma.partnerBanner.update({
      where: { id },
      data: { views_count: { increment: 1 } },
    })
  }

  async incrementBannerClicks(id: string): Promise<void> {
    await prisma.partnerBanner.update({
      where: { id },
      data: { clicks_count: { increment: 1 } },
    })
  }
}

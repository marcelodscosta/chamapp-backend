import { prisma } from '../../lib/prisma'
import {
  IProductRepository,
  CreateProductData,
  UpdateProductData,
  ListProductsParams,
} from '../interfaces/IProductRepository'
import { Product, Prisma } from '../../generated/prisma'

export class PrismaProductRepository implements IProductRepository {
  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true },
    })
  }

  async list(
    params: ListProductsParams,
  ): Promise<{ products: Product[]; total: number }> {
    const where: Prisma.ProductWhereInput = {}

    if (params.categoryId) {
      where.categoryId = params.categoryId
    }

    if (params.onlyAvailable !== undefined) {
      where.is_available = params.onlyAvailable
      where.is_active = true // Se pedir disponíveis, sempre garantir que estão ativos
    }

    const page = params.page || 1
    const limit = params.limit || 10
    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ])

    return { products, total }
  }

  async create(data: CreateProductData): Promise<Product> {
    return prisma.product.create({ data })
  }

  async update(id: string, data: UpdateProductData): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    })
  }

  async updateAvailability(id: string, isAvailable: boolean): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: { is_available: isAvailable },
    })
  }
}

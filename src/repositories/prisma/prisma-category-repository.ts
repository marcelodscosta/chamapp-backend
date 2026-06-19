import { prisma } from '../../lib/prisma'
import {
  ICategoryRepository,
  CreateCategoryData,
  UpdateCategoryData,
} from '../interfaces/ICategoryRepository'
import { ProductCategory } from '../../generated/prisma'

export class PrismaCategoryRepository implements ICategoryRepository {
  async findById(id: string): Promise<ProductCategory | null> {
    return prisma.productCategory.findUnique({ where: { id } })
  }

  async listAll(): Promise<ProductCategory[]> {
    return prisma.productCategory.findMany({
      orderBy: { order: 'asc' },
    })
  }

  async create(data: CreateCategoryData): Promise<ProductCategory> {
    return prisma.productCategory.create({ data })
  }

  async update(id: string, data: UpdateCategoryData): Promise<ProductCategory> {
    return prisma.productCategory.update({
      where: { id },
      data,
    })
  }
}

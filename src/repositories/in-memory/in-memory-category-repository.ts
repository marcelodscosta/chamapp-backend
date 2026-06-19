import {
  ICategoryRepository,
  CreateCategoryData,
  UpdateCategoryData,
} from '../interfaces/ICategoryRepository'
import { ProductCategory } from '../../generated/prisma'
import { randomUUID } from 'node:crypto'

export class InMemoryCategoryRepository implements ICategoryRepository {
  public items: ProductCategory[] = []

  async findById(id: string): Promise<ProductCategory | null> {
    return this.items.find((c) => c.id === id) ?? null
  }

  async listAll(): Promise<ProductCategory[]> {
    return this.items.sort((a, b) => a.order - b.order)
  }

  async create(data: CreateCategoryData): Promise<ProductCategory> {
    const category: ProductCategory = {
      id: randomUUID(),
      name: data.name,
      order: data.order ?? 0,
      is_active: true,
      created_at: new Date(),
    }
    this.items.push(category)
    return category
  }

  async update(id: string, data: UpdateCategoryData): Promise<ProductCategory> {
    const index = this.items.findIndex((c) => c.id === id)
    if (index === -1) throw new Error(`Category ${id} not found`)

    this.items[index] = {
      ...this.items[index],
      ...data,
    }
    return this.items[index]
  }
}

import { ProductCategory } from '../../generated/prisma'

export interface CreateCategoryData {
  name: string
  order?: number
}

export interface UpdateCategoryData {
  name?: string
  order?: number
  is_active?: boolean
}

export interface ICategoryRepository {
  findById(id: string): Promise<ProductCategory | null>
  listAll(): Promise<ProductCategory[]>
  create(data: CreateCategoryData): Promise<ProductCategory>
  update(id: string, data: UpdateCategoryData): Promise<ProductCategory>
}

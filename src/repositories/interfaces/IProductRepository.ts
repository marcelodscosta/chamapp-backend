import { Product } from '../../generated/prisma'
import { Decimal } from '../../generated/prisma/runtime/library'

export interface CreateProductData {
  categoryId?: string
  name: string
  description?: string
  price: Decimal | number
  image_url?: string
  requires_empty_return?: boolean
  is_available?: boolean
  earns_points?: boolean
  points_override?: number
  points_multiplier?: Decimal | number
}

export interface UpdateProductData {
  categoryId?: string
  name?: string
  description?: string
  price?: Decimal | number
  image_url?: string
  requires_empty_return?: boolean
  is_available?: boolean
  is_active?: boolean
  earns_points?: boolean
  points_override?: number
  points_multiplier?: Decimal | number
}

export interface ListProductsParams {
  categoryId?: string
  onlyAvailable?: boolean
  page?: number
  limit?: number
}

export interface IProductRepository {
  findById(id: string): Promise<Product | null>
  list(
    params: ListProductsParams,
  ): Promise<{ products: Product[]; total: number }>
  create(data: CreateProductData): Promise<Product>
  update(id: string, data: UpdateProductData): Promise<Product>
  updateAvailability(id: string, isAvailable: boolean): Promise<Product>
}

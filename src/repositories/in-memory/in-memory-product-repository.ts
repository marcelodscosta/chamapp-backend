import {
  IProductRepository,
  CreateProductData,
  UpdateProductData,
  ListProductsParams,
} from '../interfaces/IProductRepository'
import { Product } from '../../generated/prisma'
import { Decimal } from '../../generated/prisma/runtime/library'
import { randomUUID } from 'node:crypto'

export class InMemoryProductRepository implements IProductRepository {
  public items: Product[] = []

  async findById(id: string): Promise<Product | null> {
    return this.items.find((p) => p.id === id) ?? null
  }

  async list(
    params: ListProductsParams,
  ): Promise<{ products: Product[]; total: number }> {
    let filtered = this.items

    if (params.categoryId) {
      filtered = filtered.filter((p) => p.categoryId === params.categoryId)
    }

    if (params.onlyAvailable !== undefined) {
      filtered = filtered.filter(
        (p) => p.is_available === params.onlyAvailable && p.is_active === true,
      )
    }

    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))

    const page = params.page || 1
    const limit = params.limit || 10
    const start = (page - 1) * limit
    const end = start + limit

    return {
      products: filtered.slice(start, end),
      total: filtered.length,
    }
  }

  async create(data: CreateProductData): Promise<Product> {
    const product: Product = {
      id: randomUUID(),
      categoryId: data.categoryId ?? null,
      name: data.name,
      description: data.description ?? null,
      price: new Decimal(data.price),
      image_url: data.image_url ?? null,
      stock_quantity: 0,
      min_stock_alert: 5,
      requires_empty_return: data.requires_empty_return ?? false,
      is_available: data.is_available ?? true,
      is_active: true,
      earns_points: data.earns_points ?? true,
      points_override: data.points_override ?? null,
      points_multiplier: new Decimal(data.points_multiplier ?? 1),
      cashback_percent: null,
      created_at: new Date(),
      updated_at: new Date(),
    }
    this.items.push(product)
    return product
  }

  async update(id: string, data: UpdateProductData): Promise<Product> {
    const index = this.items.findIndex((p) => p.id === id)
    if (index === -1) throw new Error(`Product ${id} not found`)

    const updated = { ...this.items[index] }

    if (data.name !== undefined) updated.name = data.name
    if (data.categoryId !== undefined) updated.categoryId = data.categoryId
    if (data.description !== undefined) updated.description = data.description
    if (data.price !== undefined) updated.price = new Decimal(data.price)
    if (data.image_url !== undefined) updated.image_url = data.image_url
    if (data.requires_empty_return !== undefined)
      updated.requires_empty_return = data.requires_empty_return
    if (data.is_available !== undefined)
      updated.is_available = data.is_available
    if (data.is_active !== undefined) updated.is_active = data.is_active
    if (data.earns_points !== undefined)
      updated.earns_points = data.earns_points
    if (data.points_override !== undefined)
      updated.points_override = data.points_override
    if (data.points_multiplier !== undefined)
      updated.points_multiplier = new Decimal(data.points_multiplier)

    updated.updated_at = new Date()
    this.items[index] = updated
    return updated
  }

  async updateAvailability(id: string, isAvailable: boolean): Promise<Product> {
    const index = this.items.findIndex((p) => p.id === id)
    if (index === -1) throw new Error(`Product ${id} not found`)

    this.items[index].is_available = isAvailable
    this.items[index].updated_at = new Date()
    return this.items[index]
  }
}

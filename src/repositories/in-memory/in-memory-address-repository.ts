import {
  IAddressRepository,
  CreateAddressData,
  UpdateAddressData,
} from '../interfaces/IAddressRepository'
import { Address } from '../../generated/prisma'
import { randomUUID } from 'node:crypto'

export class InMemoryAddressRepository implements IAddressRepository {
  public items: Address[] = []

  async findById(id: string): Promise<Address | null> {
    return this.items.find((a) => a.id === id) ?? null
  }

  async listByCustomer(customerId: string): Promise<Address[]> {
    return this.items
      .filter((a) => a.customerId === customerId)
      .sort((a, b) => {
        if (a.is_default && !b.is_default) return -1
        if (!a.is_default && b.is_default) return 1
        return b.created_at.getTime() - a.created_at.getTime()
      })
  }

  async create(data: CreateAddressData): Promise<Address> {
    if (data.is_default) {
      this.items.forEach((a) => {
        if (a.customerId === data.customerId) a.is_default = false
      })
    }

    const address: Address = {
      id: randomUUID(),
      customerId: data.customerId,
      label: data.label ?? null,
      street: data.street,
      number: data.number,
      complement: data.complement ?? null,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      reference: data.reference ?? null,
      is_default: data.is_default ?? false,
      created_at: new Date(),
      updated_at: new Date(),
    }

    // Auto-set as default if it's the first address
    const hasOtherAddresses = this.items.some(
      (a) => a.customerId === data.customerId,
    )
    if (!hasOtherAddresses) {
      address.is_default = true
    }

    this.items.push(address)
    return address
  }

  async update(id: string, data: UpdateAddressData): Promise<Address> {
    const index = this.items.findIndex((a) => a.id === id)
    if (index === -1) throw new Error(`Address ${id} not found`)

    const updated = {
      ...this.items[index],
      ...data,
      updated_at: new Date(),
    }
    this.items[index] = updated
    return updated
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((a) => a.id === id)
    if (index !== -1) {
      this.items.splice(index, 1)
    }
  }

  async setDefault(customerId: string, addressId: string): Promise<void> {
    const index = this.items.findIndex(
      (a) => a.id === addressId && a.customerId === customerId,
    )
    if (index === -1)
      throw new Error(
        `Address ${addressId} not found for customer ${customerId}`,
      )

    this.items.forEach((a) => {
      if (a.customerId === customerId) {
        a.is_default = a.id === addressId
      }
    })
  }
}

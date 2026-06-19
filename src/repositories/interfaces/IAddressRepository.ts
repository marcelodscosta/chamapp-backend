import { Address } from '../../generated/prisma'

export interface CreateAddressData {
  customerId: string
  label?: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  reference?: string
  is_default?: boolean
}

export interface UpdateAddressData {
  label?: string
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  zip_code?: string
  reference?: string
}

export interface IAddressRepository {
  findById(id: string): Promise<Address | null>
  listByCustomer(customerId: string): Promise<Address[]>
  create(data: CreateAddressData): Promise<Address>
  update(id: string, data: UpdateAddressData): Promise<Address>
  delete(id: string): Promise<void>
  setDefault(customerId: string, addressId: string): Promise<void>
}

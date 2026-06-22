import { Order, PaymentMethod } from '../../generated/prisma'
import { IOrderRepository } from '../../repositories/interfaces/IOrderRepository'
import { IProductRepository } from '../../repositories/interfaces/IProductRepository'
import { IAddressRepository } from '../../repositories/interfaces/IAddressRepository'
import { AppError } from '../errors/app-error'
import { appEvents } from '../../lib/events'

interface CreateOrderRequestItem {
  productId: string
  quantity: number
  notes?: string
}

interface CreateOrderRequest {
  customerId: string
  addressId: string
  paymentMethod: PaymentMethod
  changeFor?: number
  hasEmptyCylinder?: boolean
  deliveryFee: number
  notes?: string
  isScheduled?: boolean
  scheduledDate?: string
  scheduledTimeSlot?: string
  items: CreateOrderRequestItem[]
}

interface CreateOrderResponse {
  order: Order
}

export class CreateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository,
    private addressRepository: IAddressRepository,
  ) {}

  async execute({
    customerId,
    addressId,
    paymentMethod,
    changeFor,
    hasEmptyCylinder,
    deliveryFee,
    notes,
    isScheduled,
    scheduledDate,
    scheduledTimeSlot,
    items,
  }: CreateOrderRequest): Promise<CreateOrderResponse> {
    if (items.length === 0) {
      throw new AppError('O pedido deve conter ao menos um item.', 400)
    }

    // 1. Validar endereço
    const address = await this.addressRepository.findById(addressId)
    if (!address) {
      throw new AppError('Endereço não encontrado.', 404)
    }
    if (address.customerId !== customerId) {
      throw new AppError('Endereço inválido.', 403)
    }

    // 2. Calcular subtotal e criar array de itens processados
    let subtotal = 0
    let requiresEmptyReturnCount = 0

    const processedItems = await Promise.all(
      items.map(async (item) => {
        const product = await this.productRepository.findById(item.productId)

        if (!product) {
          throw new AppError(`Produto ${item.productId} não encontrado.`, 404)
        }

        if (!product.is_active || !product.is_available) {
          throw new AppError(
            `Produto ${product.name} não está disponível.`,
            400,
          )
        }

        const itemSubtotal = Number(product.price) * item.quantity
        subtotal += itemSubtotal

        if (product.requires_empty_return) {
          requiresEmptyReturnCount += item.quantity
        }

        return {
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: item.quantity,
          subtotal: itemSubtotal,
          notes: item.notes,
        }
      }),
    )

    // 3. Regra do Casco: se comprou produto que exige casco, e tem_vasilhame_vazio for false,
    // o frontend deveria ter incluído um produto "Casco Vazio" na sacola, ou nós podemos forçar isso.
    // Mas por simplicidade da MVP, se precisa de casco e o cliente não avisou se tem ou não (ou disse que não tem),
    // nós apenas salvamos a informação de que ele tem ou não tem.
    // Futuro: adicionar taxa automática de casco se hasEmptyCylinder == false.

    // 4. Calcular o total
    const totalValue = subtotal + deliveryFee

    // 5. Validar troco
    if (paymentMethod === 'DINHEIRO' && changeFor) {
      if (changeFor < totalValue) {
        throw new AppError(
          'O valor do troco não pode ser menor que o total do pedido.',
          400,
        )
      }
    }

    // 6. Criar o pedido
    const order = await this.orderRepository.create({
      customerId,
      addressId,
      payment_method: paymentMethod,
      change_for: changeFor,
      has_empty_cylinder: hasEmptyCylinder,
      subtotal,
      delivery_fee: deliveryFee,
      total_value: totalValue,
      notes,
      is_scheduled: isScheduled ?? false,
      scheduled_date: scheduledDate ? new Date(scheduledDate) : undefined,
      scheduled_time_slot: scheduledTimeSlot,
      items: processedItems,
    })

    appEvents.emit('order:created', order)

    return { order }
  }
}

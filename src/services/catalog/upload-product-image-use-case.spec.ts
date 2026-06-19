import { describe, it, expect, beforeEach } from 'vitest'
import { UploadProductImageUseCase } from './upload-product-image-use-case'
import { InMemoryProductRepository } from '../../repositories/in-memory/in-memory-product-repository'
import { InMemoryStorageProvider } from '../../providers/StorageProvider/InMemoryStorageProvider'
import { AppError } from '../errors/app-error'

let productRepository: InMemoryProductRepository
let storageProvider: InMemoryStorageProvider
let sut: UploadProductImageUseCase

describe('UploadProductImageUseCase', () => {
  beforeEach(() => {
    productRepository = new InMemoryProductRepository()
    storageProvider = new InMemoryStorageProvider()
    sut = new UploadProductImageUseCase(productRepository, storageProvider)
  })

  it('deve fazer upload de uma imagem e atualizar a URL do produto', async () => {
    const product = await productRepository.create({
      name: 'Gás 13kg',
      description: 'Botijão P13',
      price: 100,
      categoryId: 'cat-1',
    })

    const response = await sut.execute({
      productId: product.id,
      fileName: 'botijao.png',
      mimetype: 'image/png',
      file: Buffer.from('fake-image-data'),
    })

    expect(response.product.image_url).toContain(
      'http://localhost:3333/uploads/',
    )
    expect(response.product.image_url).toContain(product.id)
    expect(storageProvider.files.size).toBe(1)
  })

  it('não deve aceitar arquivos que não sejam imagem', async () => {
    const product = await productRepository.create({
      name: 'Gás 13kg',
      description: 'Botijão P13',
      price: 100,
      categoryId: 'cat-1',
    })

    await expect(
      sut.execute({
        productId: product.id,
        fileName: 'document.pdf',
        mimetype: 'application/pdf',
        file: Buffer.from('fake-data'),
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})

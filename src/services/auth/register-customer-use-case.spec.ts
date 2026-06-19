import { describe, it, expect, beforeEach } from 'vitest'
import { RegisterCustomerUseCase } from './register-customer-use-case'
import { InMemoryUserRepository } from '../../repositories/in-memory/in-memory-user-repository'
import { AppError } from '../errors/app-error'

let userRepository: InMemoryUserRepository
let sut: RegisterCustomerUseCase

describe('RegisterCustomerUseCase', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new RegisterCustomerUseCase(userRepository)
  })

  it('deve registrar um cliente com sucesso', async () => {
    const { user } = await sut.execute({
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'senha123',
      phone: '(11) 99999-0001',
    })

    expect(user.id).toBeDefined()
    expect(user.email).toBe('joao@example.com')
    expect(user.role).toBe('CUSTOMER')
  })

  it('não deve retornar o hash da senha na resposta', async () => {
    const { user } = await sut.execute({
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'senha123',
    })

    expect(user).not.toHaveProperty('password_hash')
  })

  it('deve lançar erro se o e-mail já estiver em uso', async () => {
    await sut.execute({
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'senha123',
    })

    await expect(
      sut.execute({
        name: 'Outro Nome',
        email: 'joao@example.com',
        password: 'outrasenha',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('deve lançar erro com status 409 em caso de e-mail duplicado', async () => {
    await sut.execute({
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'senha123',
    })

    const promise = sut.execute({
      name: 'Outro Nome',
      email: 'joao@example.com',
      password: 'outrasenha',
    })

    await expect(promise).rejects.toMatchObject({ statusCode: 409 })
  })
})

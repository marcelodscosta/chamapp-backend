import { describe, it, expect, beforeEach } from 'vitest'
import { AuthenticateUseCase } from './authenticate-use-case'
import { InMemoryUserRepository } from '../../repositories/in-memory/in-memory-user-repository'
import { RegisterCustomerUseCase } from './register-customer-use-case'

let userRepository: InMemoryUserRepository
let sut: AuthenticateUseCase
let registerUseCase: RegisterCustomerUseCase

describe('AuthenticateUseCase', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new AuthenticateUseCase(userRepository)
    registerUseCase = new RegisterCustomerUseCase(userRepository)
  })

  it('deve autenticar um usuário com credenciais corretas', async () => {
    await registerUseCase.execute({
      name: 'Maria Souza',
      email: 'maria@example.com',
      password: 'senha123',
    })

    const { token, user } = await sut.execute({
      email: 'maria@example.com',
      password: 'senha123',
    })

    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
    expect(user.email).toBe('maria@example.com')
  })

  it('não deve retornar o hash da senha na resposta', async () => {
    await registerUseCase.execute({
      name: 'Maria Souza',
      email: 'maria@example.com',
      password: 'senha123',
    })

    const { user } = await sut.execute({
      email: 'maria@example.com',
      password: 'senha123',
    })

    expect(user).not.toHaveProperty('password_hash')
  })

  it('deve lançar erro 401 para e-mail inexistente', async () => {
    await expect(
      sut.execute({
        email: 'naoexiste@example.com',
        password: 'senha123',
      }),
    ).rejects.toMatchObject({ statusCode: 401 })
  })

  it('deve lançar erro 401 para senha errada', async () => {
    await registerUseCase.execute({
      name: 'Maria Souza',
      email: 'maria@example.com',
      password: 'senha123',
    })

    await expect(
      sut.execute({
        email: 'maria@example.com',
        password: 'senhaerrada',
      }),
    ).rejects.toMatchObject({ statusCode: 401 })
  })

  it('deve lançar AppError 403 para usuário desativado', async () => {
    await registerUseCase.execute({
      name: 'Maria Souza',
      email: 'maria@example.com',
      password: 'senha123',
    })

    // Desativa o usuário diretamente no repositório em memória
    const user = await userRepository.findByEmail('maria@example.com')
    if (user) user.is_active = false

    await expect(
      sut.execute({
        email: 'maria@example.com',
        password: 'senha123',
      }),
    ).rejects.toMatchObject({ statusCode: 403 })
  })
})

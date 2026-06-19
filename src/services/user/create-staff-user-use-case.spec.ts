import { describe, it, expect, beforeEach } from 'vitest'
import { CreateStaffUserUseCase } from './create-staff-user-use-case'
import { InMemoryUserRepository } from '../../repositories/in-memory/in-memory-user-repository'
import { Role } from '../../generated/prisma'

let userRepository: InMemoryUserRepository
let sut: CreateStaffUserUseCase

describe('CreateStaffUserUseCase', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new CreateStaffUserUseCase(userRepository)
  })

  it('deve criar um usuário staff (OPERATOR)', async () => {
    const { user } = await sut.execute({
      name: 'Operador 1',
      email: 'op@example.com',
      role: Role.OPERATOR,
    })

    expect(user.id).toBeDefined()
    expect(user.role).toBe(Role.OPERATOR)
    expect(user).not.toHaveProperty('password_hash')
  })

  it('deve lançar erro 400 ao tentar criar CUSTOMER', async () => {
    await expect(
      sut.execute({
        name: 'Cliente',
        email: 'cli@example.com',
        role: Role.CUSTOMER,
      }),
    ).rejects.toMatchObject({ statusCode: 400 })
  })

  it('deve lançar erro 409 se e-mail já existir', async () => {
    await userRepository.create({
      name: 'Admin',
      email: 'admin@example.com',
      password_hash: 'hash1',
    })

    await expect(
      sut.execute({
        name: 'Novo Admin',
        email: 'admin@example.com',
        role: Role.ADMIN,
      }),
    ).rejects.toMatchObject({ statusCode: 409 })
  })
})

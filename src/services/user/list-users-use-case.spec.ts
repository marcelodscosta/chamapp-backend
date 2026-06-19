import { describe, it, expect, beforeEach } from 'vitest'
import { ListUsersUseCase } from './list-users-use-case'
import { InMemoryUserRepository } from '../../repositories/in-memory/in-memory-user-repository'

let userRepository: InMemoryUserRepository
let sut: ListUsersUseCase

describe('ListUsersUseCase', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new ListUsersUseCase(userRepository)
  })

  it('deve listar todos os usuários sem o hash da senha', async () => {
    await userRepository.create({
      name: 'Admin',
      email: 'admin@example.com',
      password_hash: 'hash1',
    })

    await userRepository.create({
      name: 'Customer',
      email: 'customer@example.com',
      password_hash: 'hash2',
    })

    const { users } = await sut.execute()

    expect(users).toHaveLength(2)
    expect(users[0]).not.toHaveProperty('password_hash')
    expect(users[1]).not.toHaveProperty('password_hash')
  })
})

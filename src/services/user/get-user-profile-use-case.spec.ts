import { describe, it, expect, beforeEach } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile-use-case'
import { InMemoryUserRepository } from '../../repositories/in-memory/in-memory-user-repository'

let userRepository: InMemoryUserRepository
let sut: GetUserProfileUseCase

describe('GetUserProfileUseCase', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new GetUserProfileUseCase(userRepository)
  })

  it('deve obter o perfil do usuário pelo ID', async () => {
    const createdUser = await userRepository.create({
      name: 'João Silva',
      email: 'joao@example.com',
      password_hash: 'hash123',
    })

    const { user } = await sut.execute({ userId: createdUser.id })

    expect(user.id).toBe(createdUser.id)
    expect(user.name).toBe('João Silva')
  })

  it('não deve retornar o hash da senha', async () => {
    const createdUser = await userRepository.create({
      name: 'João Silva',
      email: 'joao@example.com',
      password_hash: 'hash123',
    })

    const { user } = await sut.execute({ userId: createdUser.id })

    expect(user).not.toHaveProperty('password_hash')
  })

  it('deve lançar erro 404 se o usuário não existir', async () => {
    await expect(sut.execute({ userId: 'id-invalido' })).rejects.toMatchObject({
      statusCode: 404,
    })
  })
})

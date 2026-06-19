import { describe, it, expect, beforeEach } from 'vitest'
import { ToggleUserStatusUseCase } from './toggle-user-status-use-case'
import { InMemoryUserRepository } from '../../repositories/in-memory/in-memory-user-repository'

let userRepository: InMemoryUserRepository
let sut: ToggleUserStatusUseCase

describe('ToggleUserStatusUseCase', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new ToggleUserStatusUseCase(userRepository)
  })

  it('deve desativar um usuário ativo e vice-versa', async () => {
    const createdUser = await userRepository.create({
      name: 'João',
      email: 'joao@example.com',
      password_hash: 'hash1',
    })

    expect(createdUser.is_active).toBe(true)

    // Desativa
    let response = await sut.execute({ userId: createdUser.id })
    expect(response.user.is_active).toBe(false)

    // Ativa novamente
    response = await sut.execute({ userId: createdUser.id })
    expect(response.user.is_active).toBe(true)
  })

  it('deve lançar erro 404 se o usuário não existir', async () => {
    await expect(sut.execute({ userId: 'id-invalido' })).rejects.toMatchObject({
      statusCode: 404,
    })
  })
})

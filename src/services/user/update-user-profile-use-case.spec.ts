import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateUserProfileUseCase } from './update-user-profile-use-case'
import { InMemoryUserRepository } from '../../repositories/in-memory/in-memory-user-repository'
import { compare } from 'bcryptjs'

let userRepository: InMemoryUserRepository
let sut: UpdateUserProfileUseCase

describe('UpdateUserProfileUseCase', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new UpdateUserProfileUseCase(userRepository)
  })

  it('deve atualizar o nome e telefone do usuário', async () => {
    const createdUser = await userRepository.create({
      name: 'João Silva',
      email: 'joao@example.com',
      password_hash: 'hash123',
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
      name: 'João Pedro',
      phone: '(11) 99999-9999',
    })

    expect(user.name).toBe('João Pedro')
    expect(user.phone).toBe('(11) 99999-9999')
  })

  it('deve atualizar a senha corretamente com hash', async () => {
    const createdUser = await userRepository.create({
      name: 'João Silva',
      email: 'joao@example.com',
      password_hash: 'hash123',
    })

    await sut.execute({
      userId: createdUser.id,
      password: 'newpassword123',
    })

    const updatedUser = await userRepository.findById(createdUser.id)
    expect(updatedUser?.password_hash).not.toBe('hash123')

    const isPasswordCorrect = await compare(
      'newpassword123',
      updatedUser?.password_hash || '',
    )
    expect(isPasswordCorrect).toBe(true)
  })

  it('deve lançar erro 404 se o usuário não existir', async () => {
    await expect(
      sut.execute({ userId: 'id-invalido', name: 'Teste' }),
    ).rejects.toMatchObject({ statusCode: 404 })
  })
})

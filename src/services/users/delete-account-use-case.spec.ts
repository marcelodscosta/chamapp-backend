import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUserRepository } from '../../repositories/in-memory/in-memory-user-repository'
import { DeleteAccountUseCase } from './delete-account-use-case'
import { AppError } from '../errors/app-error'

let userRepository: InMemoryUserRepository
let sut: DeleteAccountUseCase

describe('Delete Account Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new DeleteAccountUseCase(userRepository)
  })

  it('should be able to delete an account', async () => {
    const user = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    await sut.execute({ userId: user.id })

    const deletedUser = await userRepository.findById(user.id)
    
    // InMemory simula o soft delete
    expect(deletedUser?.is_active).toBe(false)
    expect(deletedUser?.name).toBe('Usuário Excluído')
    expect(deletedUser?.email).toContain('deleted_')
  })

  it('should not be able to delete a non-existing account', async () => {
    await expect(() =>
      sut.execute({ userId: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to delete an already disabled account', async () => {
    const user = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    await userRepository.toggleStatus(user.id) // Desativa a conta

    await expect(() =>
      sut.execute({ userId: user.id }),
    ).rejects.toBeInstanceOf(AppError)
  })
})

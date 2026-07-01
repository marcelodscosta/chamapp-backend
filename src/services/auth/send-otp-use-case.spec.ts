import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserRepository } from '../../repositories/in-memory/in-memory-user-repository'
import { InMemoryOtpRepository } from '../../repositories/in-memory/in-memory-otp-repository'
import { SendOtpUseCase } from './send-otp-use-case'
import { AppError } from '../errors/app-error'

let userRepository: InMemoryUserRepository
let otpRepository: InMemoryOtpRepository
let sut: SendOtpUseCase

describe('Send OTP Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    otpRepository = new InMemoryOtpRepository()
    sut = new SendOtpUseCase(userRepository, otpRepository)
  })

  it('should be able to send otp to an existing user', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    await sut.execute({
      email: 'johndoe@example.com',
    })

    expect(otpRepository.items).toHaveLength(1)
    expect(otpRepository.items[0].email).toBe('johndoe@example.com')
    expect(otpRepository.items[0].code.length).toBe(6)
  })

  it('should not throw error if user does not exist (prevent email enumeration)', async () => {
    await expect(
      sut.execute({
        email: 'nonexisting@example.com',
      })
    ).resolves.not.toThrow()

    expect(otpRepository.items).toHaveLength(0)
  })

  it('should not send otp to inactive user', async () => {
    const user = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    userRepository.items[0].is_active = false

    await expect(
      sut.execute({
        email: 'johndoe@example.com',
      })
    ).rejects.toBeInstanceOf(AppError)

    expect(otpRepository.items).toHaveLength(0)
  })
})

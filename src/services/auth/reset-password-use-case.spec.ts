import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserRepository } from '../../repositories/in-memory/in-memory-user-repository'
import { InMemoryOtpRepository } from '../../repositories/in-memory/in-memory-otp-repository'
import { ResetPasswordUseCase } from './reset-password-use-case'
import { AppError } from '../errors/app-error'
import { compare } from 'bcryptjs'

let userRepository: InMemoryUserRepository
let otpRepository: InMemoryOtpRepository
let sut: ResetPasswordUseCase

describe('Reset Password Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    otpRepository = new InMemoryOtpRepository()
    sut = new ResetPasswordUseCase(userRepository, otpRepository)
  })

  it('should be able to reset password with valid otp', async () => {
    const user = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: 'old_password_hash',
    })

    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 15)

    await otpRepository.create({
      email: 'johndoe@example.com',
      code: '123456',
      expires_at: expiresAt,
    })

    await sut.execute({
      email: 'johndoe@example.com',
      code: '123456',
      newPassword: 'new_password_123',
    })

    const updatedUser = await userRepository.findByEmail('johndoe@example.com')
    expect(updatedUser).not.toBeNull()
    
    const isPasswordCorrect = await compare('new_password_123', updatedUser!.password_hash)
    expect(isPasswordCorrect).toBe(true)

    // Ensure OTP is marked as used
    expect(otpRepository.items[0].used).toBe(true)
  })

  it('should not be able to reset password with invalid otp', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: 'old_password_hash',
    })

    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 15)

    await otpRepository.create({
      email: 'johndoe@example.com',
      code: '123456',
      expires_at: expiresAt,
    })

    await expect(
      sut.execute({
        email: 'johndoe@example.com',
        code: '654321', // Wrong code
        newPassword: 'new_password_123',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to reset password with expired otp', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: 'old_password_hash',
    })

    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() - 15) // Expired

    await otpRepository.create({
      email: 'johndoe@example.com',
      code: '123456',
      expires_at: expiresAt,
    })

    await expect(
      sut.execute({
        email: 'johndoe@example.com',
        code: '123456',
        newPassword: 'new_password_123',
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})

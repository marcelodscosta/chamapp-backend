import { hash } from 'bcryptjs'
import { User } from '../../generated/prisma'
import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { AppError } from '../errors/app-error'

interface RegisterCustomerRequest {
  name: string
  email: string
  password: string
  phone?: string
}

interface RegisterCustomerResponse {
  user: Omit<User, 'password_hash'>
}

export class RegisterCustomerUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    name,
    email,
    password,
    phone,
  }: RegisterCustomerRequest): Promise<RegisterCustomerResponse> {
    const emailAlreadyExists = await this.userRepository.findByEmail(email)

    if (emailAlreadyExists) {
      throw new AppError('Este e-mail já está em uso.', 409)
    }

    const passwordHash = await hash(password, 10)

    const user = await this.userRepository.create({
      name,
      email,
      password_hash: passwordHash,
      phone,
    })

    const { password_hash: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword }
  }
}

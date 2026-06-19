import { hash } from 'bcryptjs'
import { User, Role } from '../../generated/prisma'
import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { AppError } from '../errors/app-error'

interface CreateStaffUserRequest {
  name: string
  email: string
  password?: string
  phone?: string
  role: Role
}

interface CreateStaffUserResponse {
  user: Omit<User, 'password_hash'>
}

export class CreateStaffUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    name,
    email,
    password,
    phone,
    role,
  }: CreateStaffUserRequest): Promise<CreateStaffUserResponse> {
    if (role === Role.CUSTOMER) {
      throw new AppError(
        'Este caso de uso é apenas para criação de staff (OPERATOR, DELIVERY, ADMIN).',
        400,
      )
    }

    const emailAlreadyExists = await this.userRepository.findByEmail(email)

    if (emailAlreadyExists) {
      throw new AppError('Este e-mail já está em uso.', 409)
    }

    // Se nenhuma senha for fornecida, cria uma padrão temporária
    const plainPassword = password || 'mudar123'
    const passwordHash = await hash(plainPassword, 10)

    const user = await this.userRepository.create({
      name,
      email,
      password_hash: passwordHash,
      phone,
      role,
    })

    const { password_hash: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword }
  }
}

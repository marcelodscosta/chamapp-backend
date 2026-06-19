import { User } from '../../generated/prisma'
import { IUserRepository } from '../../repositories/interfaces/IUserRepository'

interface ListUsersResponse {
  users: Omit<User, 'password_hash'>[]
}

export class ListUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<ListUsersResponse> {
    const users = await this.userRepository.listAll()

    const usersWithoutPassword = users.map((user) => {
      const { password_hash: _, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return { users: usersWithoutPassword }
  }
}

import { PrismaClient, Role } from '../../generated/prisma'
import { hash } from 'bcryptjs'
import { AppError } from '../errors/app-error'

interface UpdateTeamMemberUseCaseRequest {
  adminId: string
  memberId: string
  name?: string
  email?: string
  phone?: string
  role?: Role
  password?: string
}

export class UpdateTeamMemberUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute({
    adminId,
    memberId,
    name,
    email,
    phone,
    role,
    password,
  }: UpdateTeamMemberUseCaseRequest) {
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
    })

    if (!admin || admin.role !== 'ADMIN') {
      throw new AppError('Acesso não autorizado.', 403)
    }

    const member = await this.prisma.user.findUnique({
      where: { id: memberId },
    })

    if (!member) {
      throw new AppError('Membro não encontrado.', 404)
    }

    if (email && email !== member.email) {
      const emailAlreadyExists = await this.prisma.user.findUnique({
        where: { email },
      })

      if (emailAlreadyExists) {
        throw new AppError('E-mail já está em uso.', 409)
      }
    }

    const dataToUpdate: any = {
      name,
      email,
      phone,
      role,
    }

    if (password) {
      dataToUpdate.password_hash = await hash(password, 6)
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: memberId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        is_active: true,
        created_at: true,
      },
    })

    return { user: updatedUser }
  }
}

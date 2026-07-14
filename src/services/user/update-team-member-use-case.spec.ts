import { expect, describe, it, beforeEach } from 'vitest'
import { UpdateTeamMemberUseCase } from './update-team-member-use-case'
import { PrismaClient } from '../../generated/prisma'
import { hash, compare } from 'bcryptjs'
import { AppError } from '../errors/app-error'

const prisma = new PrismaClient()

describe('UpdateTeamMemberUseCase', () => {
  let sut: UpdateTeamMemberUseCase

  beforeEach(() => {
    sut = new UpdateTeamMemberUseCase(prisma)
  })

  it('deve permitir que um ADMIN atualize os dados de outro membro', async () => {
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin_test_update@example.com',
        password_hash: await hash('123456', 6),
        role: 'ADMIN',
      },
    })

    const member = await prisma.user.create({
      data: {
        name: 'Member',
        email: 'member_update@example.com',
        password_hash: await hash('123456', 6),
        role: 'DELIVERY',
      },
    })

    const { user } = await sut.execute({
      adminId: admin.id,
      memberId: member.id,
      name: 'Member Updated',
      role: 'OPERATOR',
      password: 'newpassword123'
    })

    expect(user.name).toBe('Member Updated')
    expect(user.role).toBe('OPERATOR')

    // Verificar se a nova senha foi salva e tem hash válido
    const updatedMemberInDb = await prisma.user.findUnique({ where: { id: member.id } })
    const isPasswordValid = await compare('newpassword123', updatedMemberInDb!.password_hash)
    expect(isPasswordValid).toBe(true)

    // Limpar o banco
    await prisma.user.deleteMany({ where: { id: { in: [admin.id, member.id] } } })
  })

  it('não deve permitir que um não-ADMIN atualize membros', async () => {
    const operator = await prisma.user.create({
      data: {
        name: 'Operator',
        email: 'operator_test_update@example.com',
        password_hash: await hash('123456', 6),
        role: 'OPERATOR',
      },
    })

    await expect(() =>
      sut.execute({
        adminId: operator.id,
        memberId: operator.id,
        name: 'Should Fail',
      }),
    ).rejects.toBeInstanceOf(AppError)

    // Limpar o banco
    await prisma.user.deleteMany({ where: { id: operator.id } })
  })
})

import { FastifyRequest, FastifyReply } from 'fastify'
import { makeDeleteAccountUseCase } from '../../../services/users/factories/make-delete-account'
import { AppError } from '../../../services/errors/app-error'

export async function deleteAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    if (!request.user?.id) {
      return reply.status(401).send({ message: 'Não autorizado' })
    }

    const userId = request.user.id

    const deleteAccountUseCase = makeDeleteAccountUseCase()
    await deleteAccountUseCase.execute({ userId })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ message: error.message })
    }
    throw error
  }
}

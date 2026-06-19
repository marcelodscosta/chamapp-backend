import { AppError } from './app-error'

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('E-mail ou senha inválidos.', 401)
  }
}

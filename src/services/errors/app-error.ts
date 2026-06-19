export class AppError extends Error {
  public readonly statusCode: number
  public readonly message: string

  constructor(message: string, statusCode = 400) {
    super(message)
    this.message = message
    this.statusCode = statusCode
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

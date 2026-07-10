export class AppError extends Error {
  public readonly isOperational: boolean

  constructor(
    public readonly statusCode: number,
    message: string,
    isOperational = true,
    public readonly details: unknown = null
  ) {
    super(message)
    this.name = this.constructor.name
    this.isOperational = isOperational
    Error.captureStackTrace(this, this.constructor)
  }
}

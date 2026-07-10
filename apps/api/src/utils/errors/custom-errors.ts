import { AppError } from "./app-error.js"

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", details: unknown = null) {
    super(400, message, true, details)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details: unknown = null) {
    super(401, message, true, details)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details: unknown = null) {
    super(403, message, true, details)
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found", details: unknown = null) {
    super(404, message, true, details)
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", details: unknown = null) {
    super(409, message, true, details)
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = "Too Many Requests", details: unknown = null) {
    super(429, message, true, details)
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal Server Error", details: unknown = null) {
    super(500, message, false, details)
  }
}

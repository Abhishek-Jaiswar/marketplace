import { z } from "zod"

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ApiErrorIssue {
  path: string
  message: string
}

export interface ApiErrorResponse {
  error: {
    message: string
    statusCode: number
    details?: unknown
  }
}

export const idParamSchema = z.object({
  id: z.string().trim().min(1, "ID is required"),
})

export const paginationQuerySchema = (defaultLimit = 20) =>
  z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(defaultLimit),
  })

import type { Response } from "express"
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationMeta,
} from "@workspace/contracts/common"

export function sendOk<T>(res: Response, data: T, message?: string): void {
  const body: ApiResponse<T> = message ? { data, message } : { data }
  res.status(200).json(body)
}

export function sendCreated<T>(res: Response, data: T, message?: string): void {
  const body: ApiResponse<T> = message ? { data, message } : { data }
  res.status(201).json(body)
}

export function sendPaginated<T>(
  res: Response,
  { items, ...meta }: PaginationMeta & { items: T[] }
): void {
  const body: PaginatedResponse<T> = { data: items, meta }
  res.status(200).json(body)
}

"use client"

import { useSyncExternalStore } from "react"
import { MAX_LINE_QUANTITY } from "@workspace/contracts/commerce"

/** Holds a signed-out shopper's cart until sign-in merges it into their account. */

export interface GuestLine {
  key: string
  slug: string
  title: string
  option: string | null
  image: string | null
  seller: string | null
  price: number
  mrp: number
  quantity: number
}

const STORAGE_KEY = "cbs-guest-cart"
const EMPTY: GuestLine[] = []

const listeners = new Set<() => void>()
let cached: GuestLine[] | null = null

function read(): GuestLine[] {
  if (cached) return cached
  try {
    cached = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]"
    ) as GuestLine[]
  } catch {
    cached = EMPTY
  }
  return cached
}

function write(lines: GuestLine[]) {
  cached = lines
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  } catch {
    // The cart still works for this visit when storage is unavailable.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const useGuestCart = () =>
  useSyncExternalStore(subscribe, read, () => EMPTY)

export function addGuestLine(line: Omit<GuestLine, "quantity">) {
  const lines = read()
  const existing = lines.find((item) => item.key === line.key)
  write(
    existing
      ? lines.map((item) =>
          item.key === line.key
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, MAX_LINE_QUANTITY),
              }
            : item
        )
      : [...lines, { ...line, quantity: 1 }]
  )
}

export function setGuestQuantity(key: string, quantity: number) {
  write(
    read().flatMap((item) => {
      if (item.key !== key) return [item]
      return quantity <= 0
        ? []
        : [{ ...item, quantity: Math.min(quantity, MAX_LINE_QUANTITY) }]
    })
  )
}

export const clearGuestCart = () => write([])

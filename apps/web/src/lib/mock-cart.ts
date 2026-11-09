"use client"

import { useSyncExternalStore } from "react"

/** Browser-only cart. Replace with the Cart API when it ships (ADR 0006). */

export interface CartLine {
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

const STORAGE_KEY = "cbs-mock-cart"
const EMPTY: CartLine[] = []
const MAX_QUANTITY = 10

const listeners = new Set<() => void>()
let cached: CartLine[] | null = null

function read(): CartLine[] {
  if (cached) return cached
  try {
    cached = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as CartLine[]
  } catch {
    cached = EMPTY
  }
  return cached
}

function write(lines: CartLine[]) {
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

export const useCart = () => useSyncExternalStore(subscribe, read, () => EMPTY)

export function addToCart(line: Omit<CartLine, "quantity">) {
  const lines = read()
  const existing = lines.find((item) => item.key === line.key)
  write(
    existing
      ? lines.map((item) =>
          item.key === line.key
            ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY) }
            : item
        )
      : [...lines, { ...line, quantity: 1 }]
  )
}

export function setQuantity(key: string, quantity: number) {
  write(
    read().flatMap((item) => {
      if (item.key !== key) return [item]
      return quantity <= 0
        ? []
        : [{ ...item, quantity: Math.min(quantity, MAX_QUANTITY) }]
    })
  )
}

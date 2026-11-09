"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCartIcon } from "lucide-react"
import { getApiErrorMessage } from "@workspace/store"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

import { mockDeliveryDate } from "../../lib/mock-data"
import {
  useMergeGuestCart,
  useStorefrontCart,
  type CartProduct,
} from "../../lib/use-cart"

export function CartLink() {
  useMergeGuestCart()
  const { itemCount: count } = useStorefrontCart()

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
      className="relative flex items-center gap-1.5 font-medium"
    >
      <ShoppingCartIcon className="size-6" aria-hidden="true" />
      <span className="hidden sm:inline">Cart</span>
      {count > 0 ? (
        <span className="absolute -top-1.5 left-3.5 flex min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground tabular-nums">
          {count}
        </span>
      ) : null}
    </Link>
  )
}

function useBuy(item: CartProduct) {
  const router = useRouter()
  const cart = useStorefrontCart()
  const [error, setError] = useState<string>()
  const [isBusy, setIsBusy] = useState(false)
  const inCart = cart.lines.some((line) => line.key === item.key)

  const add = async (thenGoToCart: boolean) => {
    setError(undefined)
    setIsBusy(true)
    try {
      if (!inCart) await cart.add(item)
      if (thenGoToCart) router.push("/cart")
    } catch (failure) {
      setError(getApiErrorMessage(failure, "Could not add this to your cart."))
    } finally {
      setIsBusy(false)
    }
  }

  return { inCart, add, error, isBusy }
}

export function BuyButtons({
  item,
  disabled,
}: {
  item: CartProduct
  disabled: boolean
}) {
  const { inCart, add, error, isBusy } = useBuy(item)

  return (
    <div className="flex flex-col gap-2">
      {inCart ? (
        <Button
          variant="outline"
          size="lg"
          className="h-11 w-full"
          render={<Link href="/cart" />}
        >
          Go to cart
        </Button>
      ) : (
        <Button
          variant="outline"
          size="lg"
          className="h-11 w-full"
          disabled={disabled || isBusy}
          onClick={() => add(false)}
        >
          Add to cart
        </Button>
      )}
      <Button
        variant="action"
        size="lg"
        className="h-11 w-full"
        disabled={disabled || isBusy}
        onClick={() => add(true)}
      >
        Buy now
      </Button>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function MobileBuyBar({
  item,
  disabled,
  priceLabel,
}: {
  item: CartProduct
  disabled: boolean
  priceLabel: string
}) {
  const router = useRouter()
  const { inCart, add, error, isBusy } = useBuy(item)

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-card px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-xl md:hidden">
      {error ? (
        <p role="alert" className="mb-1 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <span className="text-lg font-bold tabular-nums">{priceLabel}</span>
        <Button
          variant="action"
          size="lg"
          className="px-8"
          disabled={disabled || isBusy}
          onClick={() => (inCart ? router.push("/cart") : add(false))}
        >
          {inCart ? "Go to cart" : "Add to cart"}
        </Button>
      </div>
    </div>
  )
}

const PINCODE = /^[1-9][0-9]{5}$/

export function DeliveryCheck({ handlingDays }: { handlingDays: number }) {
  const [pincode, setPincode] = useState("")
  const [result, setResult] = useState<{ ok: boolean; text: string }>()

  const check = (event: FormEvent) => {
    event.preventDefault()
    setResult(
      PINCODE.test(pincode)
        ? {
            ok: true,
            text: `Delivery to ${pincode} by ${mockDeliveryDate(handlingDays)}`,
          }
        : { ok: false, text: "Enter a valid 6-digit pincode." }
    )
  }

  return (
    <form onSubmit={check} className="mt-3">
      <div className="flex gap-2">
        <Input
          aria-label="Delivery pincode"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter pincode"
          value={pincode}
          onChange={(event) => setPincode(event.target.value)}
        />
        <Button type="submit" variant="outline" className="h-10">
          Check
        </Button>
      </div>
      {result ? (
        <p
          className={`mt-1.5 text-sm ${result.ok ? "text-success" : "text-destructive"}`}
        >
          {result.text}
        </p>
      ) : null}
    </form>
  )
}

const pad = (value: number) => String(value).padStart(2, "0")

function untilMidnight(): string {
  const now = new Date()
  const end = new Date(now)
  end.setHours(24, 0, 0, 0)
  const seconds = Math.floor((end.getTime() - now.getTime()) / 1000)
  return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}`
}

export function DealCountdown() {
  const [left, setLeft] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => setLeft(untilMidnight())
    const first = setTimeout(tick, 0)
    const timer = setInterval(tick, 1000)
    return () => {
      clearTimeout(first)
      clearInterval(timer)
    }
  }, [])

  return (
    <span className="text-sm whitespace-nowrap tabular-nums">
      {left ? `Ends in ${left}` : " "}
    </span>
  )
}

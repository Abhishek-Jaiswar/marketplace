"use client"

import { useEffect, useRef } from "react"
import { shippingFor } from "@workspace/contracts/commerce"
import {
  useAddCartItemMutation,
  useAppSelector,
  useGetCartQuery,
  useGetMeQuery,
  useMergeCartMutation,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@workspace/store"

import {
  addGuestLine,
  clearGuestCart,
  setGuestQuantity,
  useGuestCart,
  type GuestLine,
} from "./guest-cart"

export type CartProduct = Omit<GuestLine, "quantity">

export interface DisplayLine extends GuestLine {
  /** The server's line id; null while the shopper is signed out. */
  itemId: string | null
  availableStock: number | null
  isPurchasable: boolean
  priceChanged: boolean
}

/** Whether a session exists, once the first check has finished. */
export function useSession() {
  const { isLoading, isUninitialized } = useGetMeQuery()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return { isAuthenticated, isChecking: isLoading || isUninitialized }
}

export function useStorefrontCart() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const guest = useGuestCart()
  const { data, isLoading } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  })
  const [addItem] = useAddCartItemMutation()
  const [updateItem] = useUpdateCartItemMutation()
  const [removeItem] = useRemoveCartItemMutation()

  const server = isAuthenticated ? data?.data : undefined
  const lines: DisplayLine[] = isAuthenticated
    ? (server?.lines ?? []).map((line) => ({
        key: line.sellerListingId,
        itemId: line.id,
        slug: line.slug,
        title: line.title,
        option: line.option,
        image: line.image,
        seller: line.seller,
        price: line.price,
        mrp: line.mrp,
        quantity: line.quantity,
        availableStock: line.availableStock,
        isPurchasable: line.isPurchasable,
        priceChanged: line.priceChanged,
      }))
    : guest.map((line) => ({
        ...line,
        itemId: null,
        availableStock: null,
        isPurchasable: true,
        priceChanged: false,
      }))

  const sum = (value: (line: DisplayLine) => number) =>
    lines.reduce((total, line) => total + value(line), 0)
  const subtotal = sum((line) => line.price * line.quantity)
  const shippingTotal = shippingFor(subtotal)

  return {
    lines,
    isAuthenticated,
    isLoading: isAuthenticated && isLoading,
    itemCount: sum((line) => line.quantity),
    mrpTotal: sum((line) => line.mrp * line.quantity),
    subtotal,
    shippingTotal,
    total: subtotal + shippingTotal,

    add: async (product: CartProduct) => {
      if (isAuthenticated) {
        await addItem({ sellerListingId: product.key, quantity: 1 }).unwrap()
      } else {
        addGuestLine(product)
      }
    },

    setQuantity: async (line: DisplayLine, quantity: number) => {
      if (!line.itemId) {
        setGuestQuantity(line.key, quantity)
      } else if (quantity <= 0) {
        await removeItem(line.itemId).unwrap()
      } else {
        await updateItem({ id: line.itemId, quantity }).unwrap()
      }
    },
  }
}

/** Moves a signed-out cart into the account as soon as a session appears. */
export function useMergeGuestCart() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const guest = useGuestCart()
  const [merge] = useMergeCartMutation()
  const isMerging = useRef(false)

  useEffect(() => {
    if (!isAuthenticated || guest.length === 0 || isMerging.current) return

    isMerging.current = true
    merge({
      items: guest.map((line) => ({
        sellerListingId: line.key,
        quantity: line.quantity,
      })),
    })
      .unwrap()
      .then(clearGuestCart)
      .catch(() => undefined)
      .finally(() => {
        isMerging.current = false
      })
  }, [isAuthenticated, guest, merge])
}

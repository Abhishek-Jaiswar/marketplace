"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import type { PaymentChoice } from "@workspace/contracts/commerce"
import {
  getApiErrorMessage,
  useCreateCustomerAddressMutation,
  useGetCustomerProfileQuery,
  usePlaceOrderMutation,
} from "@workspace/store"
import { Button } from "@workspace/ui/components/button"
import { Field } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Select } from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"

import { PriceSummary } from "../../../components/storefront/price-summary"
import { INDIAN_STATES } from "../../../lib/india"
import { useSession, useStorefrontCart } from "../../../lib/use-cart"

const choiceClasses = (active: boolean) =>
  cn(
    "flex cursor-pointer items-start gap-3 rounded-md border p-3",
    active ? "border-primary bg-tint-sky" : "border-input"
  )

const EMPTY_ADDRESS = {
  recipientName: "",
  phoneNumber: "",
  street1: "",
  street2: "",
  city: "",
  postalCode: "",
}

function AddressForm({
  onSaved,
  onCancel,
}: {
  onSaved: (id: string) => void
  onCancel?: (() => void) | undefined
}) {
  const [createAddress, { isLoading }] = useCreateCustomerAddressMutation()
  const [form, setForm] = useState(EMPTY_ADDRESS)
  const [state, setState] = useState<string | null>(null)
  const [error, setError] = useState<string>()
  const bind = (key: keyof typeof EMPTY_ADDRESS) => ({
    value: form[key],
    onChange: (event: { target: { value: string } }) =>
      setForm((current) => ({ ...current, [key]: event.target.value })),
  })

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!state) {
      setError("Choose a state.")
      return
    }
    setError(undefined)
    try {
      const { street2, ...rest } = form
      const { address } = await createAddress({
        ...rest,
        ...(street2.trim() ? { street2 } : {}),
        state,
        country: "India",
      }).unwrap()
      onSaved(address.id)
    } catch (failure) {
      setError(getApiErrorMessage(failure, "Could not save this address."))
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <Field label="Full name">
        <Input autoComplete="name" required {...bind("recipientName")} />
      </Field>
      <Field label="Mobile number">
        <Input
          type="tel"
          autoComplete="tel"
          inputMode="numeric"
          required
          minLength={10}
          maxLength={10}
          pattern="[6-9][0-9]{9}"
          {...bind("phoneNumber")}
        />
      </Field>
      <Field label="Address" className="sm:col-span-2">
        <Input autoComplete="address-line1" required {...bind("street1")} />
      </Field>
      <Field label="Area or landmark (optional)" className="sm:col-span-2">
        <Input autoComplete="address-line2" {...bind("street2")} />
      </Field>
      <Field label="City">
        <Input autoComplete="address-level2" required {...bind("city")} />
      </Field>
      <Field label="Pincode">
        <Input
          autoComplete="postal-code"
          inputMode="numeric"
          required
          minLength={6}
          maxLength={6}
          pattern="[1-9][0-9]{5}"
          {...bind("postalCode")}
        />
      </Field>
      <Field label="State" className="sm:col-span-2">
        <Select
          aria-label="State"
          options={INDIAN_STATES}
          value={state}
          onValueChange={setState}
          placeholder="Choose a state"
        />
      </Field>
      {error ? (
        <p role="alert" className="text-destructive sm:col-span-2">
          {error}
        </p>
      ) : null}
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" disabled={isLoading}>
          Save address
        </Button>
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { isAuthenticated, isChecking } = useSession()
  const cart = useStorefrontCart()
  const { data: profile, isLoading: isProfileLoading } =
    useGetCustomerProfileQuery(undefined, { skip: !isAuthenticated })
  const [placeOrder, { isLoading: isPlacing }] = usePlaceOrderMutation()

  const addresses = profile?.customer.addresses ?? []
  const [chosenId, setChosenId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [payment, setPayment] = useState<PaymentChoice>("COD")
  const [error, setError] = useState<string>()
  // One key per visit, so a double click or retry cannot place two orders.
  const [idempotencyKey] = useState(() => crypto.randomUUID())
  const [placedOrder, setPlacedOrder] = useState(false)

  const selectedId = chosenId ?? addresses[0]?.id ?? null
  const showForm = isAdding || (!isProfileLoading && addresses.length === 0)

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.replace("/login?next=%2Fcheckout")
    }
  }, [isChecking, isAuthenticated, router])

  useEffect(() => {
    if (
      isAuthenticated &&
      !cart.isLoading &&
      !placedOrder &&
      cart.lines.length === 0
    ) {
      router.replace("/cart")
    }
  }, [isAuthenticated, cart.isLoading, cart.lines.length, placedOrder, router])

  if (!isAuthenticated || cart.isLoading) {
    return <p className="p-6 text-muted-foreground">Loading checkout.</p>
  }

  const submit = async () => {
    if (!selectedId) {
      setError("Add a delivery address to continue.")
      return
    }
    setError(undefined)
    setPlacedOrder(true)
    try {
      const { data } = await placeOrder({
        addressId: selectedId,
        paymentMethod: payment,
        idempotencyKey,
        expectedTotal: cart.total,
      }).unwrap()
      router.replace(`/orders/${data.orderNumber}?placed=1`)
    } catch (failure) {
      setPlacedOrder(false)
      setError(getApiErrorMessage(failure, "Could not place your order."))
    }
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-2 sm:gap-3 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-2 sm:space-y-3">
        <section className="bg-card p-4 sm:rounded-lg">
          <h1 className="text-xl font-semibold">Delivery address</h1>
          <div className="mt-3 space-y-2">
            {!showForm
              ? addresses.map((address) => (
                  <label
                    key={address.id}
                    className={choiceClasses(selectedId === address.id)}
                  >
                    <input
                      type="radio"
                      name="address"
                      className="mt-1"
                      checked={selectedId === address.id}
                      onChange={() => setChosenId(address.id)}
                    />
                    <span>
                      <span className="block font-semibold">
                        {address.recipientName ?? "Delivery address"}
                      </span>
                      <span className="block">
                        {address.street1}
                        {address.street2 ? `, ${address.street2}` : ""},{" "}
                        {address.city}, {address.state} {address.postalCode}
                      </span>
                      {address.phoneNumber ? (
                        <span className="block text-sm text-muted-foreground">
                          {address.phoneNumber}
                        </span>
                      ) : null}
                    </span>
                  </label>
                ))
              : null}
            {isProfileLoading ? null : showForm ? (
              <AddressForm
                onCancel={
                  addresses.length > 0 ? () => setIsAdding(false) : undefined
                }
                onSaved={(id) => {
                  setChosenId(id)
                  setIsAdding(false)
                }}
              />
            ) : (
              <Button variant="outline" onClick={() => setIsAdding(true)}>
                Add a new address
              </Button>
            )}
          </div>
        </section>

        <section className="bg-card p-4 sm:rounded-lg">
          <h2 className="text-xl font-semibold">Payment</h2>
          <div className="mt-3 space-y-2">
            <label className={choiceClasses(payment === "COD")}>
              <input
                type="radio"
                name="payment"
                className="mt-1"
                checked={payment === "COD"}
                onChange={() => setPayment("COD")}
              />
              <span>
                <span className="block font-semibold">Cash on delivery</span>
                <span className="block text-sm text-muted-foreground">
                  Pay when your order arrives
                </span>
              </span>
            </label>
            {process.env.NODE_ENV !== "production" ? (
              <label className={choiceClasses(payment === "ONLINE")}>
                <input
                  type="radio"
                  name="payment"
                  className="mt-1"
                  checked={payment === "ONLINE"}
                  onChange={() => setPayment("ONLINE")}
                />
                <span>
                  <span className="block font-semibold">
                    Pay online (test mode)
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    No money moves. The payment succeeds straight away.
                  </span>
                </span>
              </label>
            ) : null}
          </div>
        </section>

        <section className="bg-card p-4 sm:rounded-lg">
          <h2 className="text-xl font-semibold">Your items</h2>
          <ul className="mt-2 divide-y divide-border">
            {cart.lines.map((line) => (
              <li key={line.key} className="flex justify-between gap-4 py-2">
                <span className="min-w-0">
                  <span className="line-clamp-1">{line.title}</span>
                  <span className="block text-sm text-muted-foreground">
                    Qty {line.quantity}
                    {line.seller ? `, sold by ${line.seller}` : ""}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="self-start bg-card p-4 sm:rounded-lg lg:sticky lg:top-28">
        <PriceSummary
          mrpTotal={cart.mrpTotal}
          subtotal={cart.subtotal}
          shippingTotal={cart.shippingTotal}
          total={cart.total}
        />
        {error ? (
          <p role="alert" className="mt-3 text-destructive">
            {error}
          </p>
        ) : null}
        <Button
          variant="action"
          size="lg"
          className="mt-4 h-11 w-full"
          disabled={isPlacing || !selectedId || showForm}
          onClick={submit}
        >
          Place order
        </Button>
      </aside>
    </div>
  )
}

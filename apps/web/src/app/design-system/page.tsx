import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Logo } from "@workspace/ui/components/logo"
import { Price } from "@workspace/ui/components/price"
import { brand } from "@workspace/ui/lib/brand"
import { formatInr } from "@workspace/ui/lib/money"
import { KitPreview } from "./kit-preview"

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
}

const swatches = [
  {
    name: "Mor",
    hex: "#0E3F4B",
    role: "Text, brand, navigation",
    ink: "light",
  },
  { name: "Haldi", hex: "#F5B800", role: "The one commit action", ink: "dark" },
  {
    name: "Sindoor",
    hex: "#B8321E",
    role: "Discounts and errors",
    ink: "light",
  },
  { name: "Mehendi", hex: "#3F6B2A", role: "In stock, approved", ink: "light" },
  { name: "Kagaz", hex: "#F3F6F4", role: "Dashboard canvas", ink: "dark" },
  { name: "Pencil", hex: "#5C6B70", role: "Secondary text", ink: "light" },
]

const logoVariants = [
  {
    label: "Horizontal",
    props: { variant: "full", orientation: "horizontal" },
  },
  { label: "Vertical", props: { variant: "full", orientation: "vertical" } },
  { label: "Symbol only", props: { variant: "mark" } },
  { label: "Name only", props: { variant: "name" } },
] as const

const todayTasks = [
  { count: 3, task: "orders to pack before 4 pm" },
  { count: 2, task: "items running low" },
  { count: 1, task: "document sent back for changes" },
]

const ledger = [
  {
    date: "9 Nov",
    detail: "Sale, order 4821",
    amount: 1249900,
    balance: 4318200,
  },
  {
    date: "9 Nov",
    detail: "Commission, order 4821",
    amount: -124990,
    balance: 3068300,
  },
  {
    date: "8 Nov",
    detail: "Payout to HDFC 4417",
    amount: -5000000,
    balance: 3193290,
  },
]

const queue = [
  { name: "Apex Tech Gear", waiting: "2 hours", active: true },
  { name: "Lumina Home and Goods", waiting: "5 hours", active: false },
  { name: "Vogue Threads Studio", waiting: "1 day", active: false },
  { name: "BioNutra Wellness", waiting: "2 days", active: false },
]

const checks = [
  { step: "GSTIN", state: "Matches registry", ok: true },
  { step: "PAN", state: "Matches registry", ok: true },
  { step: "Bank account", state: "Name differs from PAN", ok: false },
]

function Section({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-border py-12">
      <h2 className="text-xl font-semibold">{title}</h2>
      {note ? (
        <p className="mt-1 max-w-prose text-muted-foreground">{note}</p>
      ) : null}
      <div className="mt-8">{children}</div>
    </section>
  )
}

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-8">
      <header className="flex items-center justify-between py-6">
        <Logo size="md" />
        <p className="text-sm text-muted-foreground">Design system</p>
      </header>

      <div className="pt-10 pb-16">
        <Price amount={1249900} mrp={1599900} size="xl" showTaxNote />
        <p className="mt-8 max-w-[34rem] text-lg">
          Every product in India carries a printed price. {brand.name} builds on
          that label: the price is the loudest thing on the screen, and
          everything around it stays quiet.
        </p>
      </div>

      <Section
        title="Logo"
        note="One component, four forms. The name comes from configuration."
      >
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {logoVariants.map(({ label, props }) => (
            <div key={label} className="flex flex-col bg-card">
              <div className="flex min-h-36 items-center justify-center p-6">
                <Logo size="lg" {...props} />
              </div>
              <div className="flex min-h-36 items-center justify-center bg-primary p-6">
                <Logo size="lg" tone="inverse" {...props} />
              </div>
              <p className="px-4 py-3 text-sm">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4">
          <Logo size="sm" />
          <Logo size="md" descriptor={brand.sellerProductName} />
          <Logo size="lg" descriptor={brand.adminProductName} />
          <Logo size="md" name="Any name" />
        </div>
      </Section>

      <Section
        title="Colour"
        note="Haldi appears once per screen, on the action that commits."
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {swatches.map((swatch) => (
            <li
              key={swatch.name}
              className={`flex min-h-32 flex-col justify-end rounded-lg border border-border p-4 ${
                swatch.ink === "light" ? "text-white" : "text-foreground"
              }`}
              style={{ backgroundColor: swatch.hex }}
            >
              <span className="text-lg font-semibold">{swatch.name}</span>
              <span className="text-sm">{swatch.role}</span>
              <span className="text-sm tabular-nums">{swatch.hex}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Type" note="Anek Latin, one family at three widths.">
        <div className="space-y-8">
          <div data-surface="storefront">
            <p className="text-sm text-muted-foreground">Storefront, wide</p>
            <p className="text-4xl font-bold type-display">
              Wireless headphones
            </p>
          </div>
          <div data-surface="seller">
            <p className="text-sm text-muted-foreground">
              Seller Central, normal
            </p>
            <p className="text-4xl font-bold type-display">
              Wireless headphones
            </p>
          </div>
          <div data-surface="admin">
            <p className="text-sm text-muted-foreground">
              Admin Central, condensed
            </p>
            <p className="text-4xl font-bold type-display">
              Wireless headphones
            </p>
          </div>
        </div>
      </Section>

      <Section title="Controls">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="action" size="lg">
            Add to cart
          </Button>
          <Button size="lg">Save changes</Button>
          <Button variant="outline" size="lg">
            Cancel
          </Button>
          <Button variant="ghost" size="lg">
            Skip for now
          </Button>
          <Button variant="destructive" size="lg">
            Reject seller
          </Button>
        </div>
      </Section>

      <KitPreview />

      <Section title="Storefront" note="Roomy, led by the photo and the price.">
        <div data-surface="storefront" className="grid gap-8 md:grid-cols-2">
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            Product photo
          </div>
          <div>
            <p className="text-muted-foreground">Sold by Apex Tech Gear</p>
            <h3 className="mt-1 text-2xl font-semibold">
              Noise-cancelling wireless headphones, 40 hour battery
            </h3>
            <Price
              className="mt-6"
              amount={1249900}
              mrp={1599900}
              size="lg"
              showTaxNote
            />
            <p className="mt-6 text-success">In stock</p>
            <p className="text-muted-foreground">
              Delivered to 411001 by Thursday
            </p>
            <Button
              variant="action"
              size="lg"
              className="mt-6 h-12 w-full sm:w-64"
            >
              Add to cart
            </Button>
          </div>
        </div>
      </Section>

      <Section
        title="Seller Central"
        note="What needs attention today, then the money."
      >
        <div
          data-surface="seller"
          className="grid gap-8 lg:grid-cols-[1fr_2fr]"
        >
          <ul className="divide-y divide-border self-start rounded-lg border border-border bg-card">
            {todayTasks.map((item) => (
              <li
                key={item.task}
                className="flex row-density items-center gap-3 px-4"
              >
                <span className="text-xl font-bold tabular-nums">
                  {item.count}
                </span>
                <span>{item.task}</span>
              </li>
            ))}
          </ul>
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full min-w-[32rem] text-left">
              <thead className="text-sm text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium">Detail</th>
                  <th className="px-4 py-2 text-right font-medium">Amount</th>
                  <th className="px-4 py-2 text-right font-medium">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border border-t border-border">
                {ledger.map((row) => (
                  <tr key={row.detail}>
                    <td className="px-4 py-3">{row.date}</td>
                    <td className="px-4 py-3">{row.detail}</td>
                    <td
                      className={`px-4 py-3 text-right tabular-nums ${
                        row.amount < 0 ? "" : "text-success"
                      }`}
                    >
                      {formatInr(row.amount)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatInr(row.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section
        title="Admin Central"
        note="Condensed, with the queue and the decision side by side."
      >
        <div
          data-surface="admin"
          className="grid overflow-hidden rounded-lg border border-border bg-card text-sm md:grid-cols-[18rem_1fr]"
        >
          <ul className="divide-y divide-border border-b border-border md:border-r md:border-b-0">
            {queue.map((seller) => (
              <li
                key={seller.name}
                className={`flex row-density items-center justify-between px-3 ${
                  seller.active ? "bg-accent font-semibold" : ""
                }`}
              >
                <span>{seller.name}</span>
                <span className="text-muted-foreground">{seller.waiting}</span>
              </li>
            ))}
          </ul>
          <div className="p-4">
            <h3 className="text-lg font-semibold">Apex Tech Gear</h3>
            <dl className="mt-3 divide-y divide-border border-y border-border">
              {checks.map((check) => (
                <div
                  key={check.step}
                  className="flex row-density items-center justify-between"
                >
                  <dt>{check.step}</dt>
                  <dd
                    className={check.ok ? "text-success" : "text-destructive"}
                  >
                    {check.state}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex gap-2">
              <Button variant="action">Approve seller</Button>
              <Button variant="outline">Send back</Button>
              <Button variant="destructive">Reject</Button>
            </div>
          </div>
        </div>
      </Section>
    </main>
  )
}

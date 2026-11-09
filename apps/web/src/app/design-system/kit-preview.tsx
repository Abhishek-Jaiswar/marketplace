"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  DataTable,
  type DataTableColumn,
} from "@workspace/ui/components/data-table"
import { Field } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { MetricList, PageHeader } from "@workspace/ui/components/page-layout"
import { Pagination } from "@workspace/ui/components/pagination"
import { Stepper, Timeline } from "@workspace/ui/components/progress-steps"
import { Select } from "@workspace/ui/components/select"
import { EmptyState, ErrorState } from "@workspace/ui/components/states"
import { StatusPill } from "@workspace/ui/components/status-pill"
import { Switch } from "@workspace/ui/components/switch"
import {
  Tabs,
  TabsList,
  TabsPanel,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { Textarea } from "@workspace/ui/components/textarea"
import { formatInr } from "@workspace/ui/lib/money"

interface Order {
  id: string
  customer: string
  status: string
  total: number
}

const orders: Order[] = [
  { id: "4821", customer: "Priya Nair", status: "NEW", total: 1249900 },
  { id: "4820", customer: "Rahul Verma", status: "PACKED", total: 349900 },
  { id: "4819", customer: "Ananya Das", status: "SHIPPED", total: 89900 },
  { id: "4818", customer: "Vikram Rao", status: "DELIVERED", total: 2199900 },
]

const columns: DataTableColumn<Order>[] = [
  { key: "id", header: "Order", cell: (row) => row.id },
  { key: "customer", header: "Customer", cell: (row) => row.customer },
  {
    key: "status",
    header: "Status",
    cell: (row) => <StatusPill status={row.status} />,
  },
  {
    key: "total",
    header: "Total",
    numeric: true,
    cell: (row) => formatInr(row.total),
  },
]

const statusSamples = [
  "UNDER_REVIEW",
  "DOCUMENTS_PENDING",
  "APPROVED",
  "REJECTED",
  "OUT_OF_STOCK",
  "NEW",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "ON_HOLD",
  "PAID",
]

const reasons = [
  { value: "RESTOCK", label: "Restock" },
  { value: "DAMAGE_WRITEOFF", label: "Damaged stock" },
  { value: "INVENTORY_AUDIT_ADJUSTMENT", label: "Stock count correction" },
]

function Block({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-border py-12">
      <h2 className="mb-8 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  )
}

export function KitPreview() {
  const [page, setPage] = useState(2)
  const [reason, setReason] = useState<string | null>("RESTOCK")

  return (
    <>
      <Block title="Forms">
        <div className="grid max-w-2xl gap-5 sm:grid-cols-2">
          <Field label="Store name" hint="Shoppers see this on your products.">
            <Input defaultValue="Apex Tech Gear" />
          </Field>
          <Field label="GSTIN" error="Enter all 15 characters of your GSTIN.">
            <Input defaultValue="27AAPFU0939" />
          </Field>
          <Field label="Reason for stock change">
            <Select
              aria-label="Reason for stock change"
              options={reasons}
              value={reason}
              onValueChange={setReason}
            />
          </Field>
          <Field label="Quantity">
            <Input type="number" defaultValue={10} />
          </Field>
          <Field label="Note" className="sm:col-span-2">
            <Textarea placeholder="Add a note for your records" />
          </Field>
          <div className="flex flex-col gap-3 sm:col-span-2">
            <Checkbox defaultChecked>Offer cash on delivery</Checkbox>
            <Switch defaultChecked>Listing is live</Switch>
          </div>
        </div>
      </Block>

      <Block title="Status">
        <div className="flex flex-wrap gap-2">
          {statusSamples.map((status) => (
            <StatusPill key={status} status={status} />
          ))}
        </div>
      </Block>

      <Block title="Page structure">
        <div data-surface="seller" className="space-y-4">
          <PageHeader
            title="Orders"
            description="Pack new orders before their ship-by time."
            actions={<Button variant="action">Print labels</Button>}
          />
          <MetricList
            metrics={[
              { label: "To pack", value: 3 },
              { label: "To ship today", value: 7 },
              { label: "Available balance", value: formatInr(4318200) },
            ]}
          />
          <Tabs defaultValue="new">
            <TabsList>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="packed">Packed</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
            </TabsList>
            <TabsPanel value="new">
              <DataTable
                caption="Orders"
                columns={columns}
                rows={orders}
                rowKey={(row) => row.id}
                footer={
                  <Pagination
                    page={page}
                    totalPages={9}
                    total={172}
                    onPageChange={setPage}
                  />
                }
              />
            </TabsPanel>
            <TabsPanel value="packed">
              <DataTable
                caption="Packed orders"
                columns={columns}
                rows={[]}
                rowKey={(row) => row.id}
                isLoading
              />
            </TabsPanel>
            <TabsPanel value="shipped">
              <DataTable
                caption="Shipped orders"
                columns={columns}
                rows={[]}
                rowKey={(row) => row.id}
                empty={{
                  title: "No shipped orders",
                  description:
                    "Orders appear here once a carrier collects them.",
                }}
              />
            </TabsPanel>
          </Tabs>
        </div>
      </Block>

      <Block title="Empty and failed">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card">
            <EmptyState
              title="No products yet"
              description="List your first product to start selling."
              action={<Button>Add product</Button>}
            />
          </div>
          <div className="rounded-lg border border-border bg-card">
            <ErrorState
              message="Your orders could not be loaded."
              onRetry={() => undefined}
            />
          </div>
        </div>
      </Block>

      <Block title="Progress">
        <div className="grid gap-10 md:grid-cols-2">
          <Stepper
            steps={["Business", "Store", "Bank", "Documents"]}
            current={2}
          />
          <Timeline
            events={[
              {
                title: "Out for delivery",
                detail: "Pune hub",
                time: "Today, 9:12 am",
              },
              { title: "Shipped", time: "Yesterday, 6:40 pm" },
              { title: "Order placed", time: "8 Nov, 2:03 pm" },
            ]}
          />
        </div>
      </Block>
    </>
  )
}

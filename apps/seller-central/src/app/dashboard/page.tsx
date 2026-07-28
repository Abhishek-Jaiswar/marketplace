"use client"

import React from "react"
import Link from "next/link"
import { useGetSellerMeQuery } from "@workspace/store"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  TrendingUpIcon,
  ShoppingBagIcon,
  AlertTriangleIcon,
  StarIcon,
  PlusIcon,
  DownloadIcon,
  ArrowUpRightIcon,
  CreditCardIcon,
  PackageIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  XCircleIcon,
} from "lucide-react"

const recentOrders = [
  {
    id: "ORD-9482",
    customer: "Sarah Jenkins",
    email: "sarah.j@example.com",
    date: "Today, 10:24 AM",
    status: "processing" as const,
    amount: "$249.00",
    items: 3,
  },
  {
    id: "ORD-9481",
    customer: "Michael Chen",
    email: "m.chen@example.com",
    date: "Today, 09:12 AM",
    status: "shipped" as const,
    amount: "$120.50",
    items: 1,
  },
  {
    id: "ORD-9480",
    customer: "Emma Watson",
    email: "emma.w@example.com",
    date: "Yesterday",
    status: "shipped" as const,
    amount: "$89.99",
    items: 2,
  },
  {
    id: "ORD-9479",
    customer: "David Miller",
    email: "d.miller@example.com",
    date: "Yesterday",
    status: "pending" as const,
    amount: "$450.00",
    items: 5,
  },
  {
    id: "ORD-9478",
    customer: "Sophia Taylor",
    email: "sophia.t@example.com",
    date: "Jul 25, 2026",
    status: "shipped" as const,
    amount: "$75.20",
    items: 1,
  },
]

const topProducts = [
  { name: "Wireless Noise-Canceling Headphones", sales: 342, stock: 48, price: "$199.00" },
  { name: "Ergonomic Mechanical Keyboard", sales: 215, stock: 12, price: "$149.50" },
  { name: "Ultra-wide 34\" Curved Monitor", sales: 180, stock: 4, price: "$599.00" },
  { name: "USB-C Multi-port Hub", sales: 145, stock: 85, price: "$49.99" },
]

export default function SellerDashboard() {
  const { data: sellerData } = useGetSellerMeQuery()
  const seller = sellerData?.seller

  const isUnderReview = seller?.status === "UNDER_REVIEW"
  const isRejected = seller?.status === "REJECTED"
  const isApproved = seller?.status === "APPROVED"

  const rejectionRemarks = seller?.verification?.remarks || "Please review your uploaded documents and details."

  return (
    <div className="flex flex-col gap-6">
      {/* Real-time Status Banners for Great UX */}
      {isUnderReview && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <ClockIcon className="size-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Merchant Application Under Review</div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Our administration team is currently verifying your GSTIN & business details. Features will unlock upon approval.
              </p>
            </div>
          </div>
          <Badge variant="warning" className="shrink-0">
            Pending Admin Verification
          </Badge>
        </div>
      )}

      {isRejected && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-900 dark:text-rose-200">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400">
              <XCircleIcon className="size-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Action Needed: Application Revision Requested</div>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5 font-medium">
                Admin Remarks: &quot;{rejectionRemarks}&quot;
              </p>
            </div>
          </div>
          <Button render={<Link href="/onboard" />} size="sm" variant="destructive" className="shrink-0 gap-1.5">
            Update Application Details
            <ArrowRightIcon className="size-3.5" />
          </Button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Seller Overview
            </h1>
            {isApproved && (
              <Badge variant="success" className="gap-1">
                <ShieldCheckIcon className="size-3" /> Verified Seller
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Monitor your store sales, fulfillment pipeline, and performance metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <DownloadIcon className="size-4" />
            Export Data
          </Button>
          <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
            <PlusIcon className="size-4" />
            Add New Product
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Revenue
            </CardTitle>
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <TrendingUpIcon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$48,250.00</div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              <span className="font-semibold">+14.2%</span> from last month
            </div>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="border-l-4 border-l-sky-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Orders
            </CardTitle>
            <div className="rounded-lg bg-sky-500/10 p-2 text-sky-600 dark:text-sky-400">
              <ShoppingBagIcon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <span className="font-medium text-foreground">18 orders</span> waiting for dispatch
            </div>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Inventory Alert
            </CardTitle>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
              <AlertTriangleIcon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4 Items</div>
            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 mt-1">
              Stock below threshold (&lt;5 units)
            </div>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Store Rating
            </CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <StarIcon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9 / 5.0</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              Based on <span className="font-medium text-foreground">1,240 reviews</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Recent Orders Table (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Live order stream from your storefront.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary">
              View All Orders
              <ArrowUpRightIcon className="size-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto rounded-lg border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{order.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-xs text-muted-foreground">{order.email}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{order.date}</td>
                      <td className="px-4 py-3">
                        {order.status === "shipped" && (
                          <Badge variant="success">Shipped</Badge>
                        )}
                        {order.status === "processing" && (
                          <Badge variant="info">Processing</Badge>
                        )}
                        {order.status === "pending" && (
                          <Badge variant="warning">Pending</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Payout Balance & Top Products */}
        <div className="flex flex-col gap-6">
          {/* Payout Card */}
          <Card className="bg-gradient-to-br from-primary/5 via-card to-card border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-muted-foreground">
                  Available Payout Balance
                </CardTitle>
                <CreditCardIcon className="size-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <div className="text-3xl font-extrabold text-foreground">$12,450.00</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Next scheduled payout on <span className="font-semibold text-foreground">Aug 1, 2026</span>
                </p>
              </div>
              <Button size="sm" className="w-full gap-1.5">
                Request Instant Withdrawal
              </Button>
            </CardContent>
          </Card>

          {/* Top Selling Products Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <PackageIcon className="size-4 text-primary" />
                Top Selling Products
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {topProducts.map((prod) => (
                <div key={prod.name} className="flex items-center justify-between text-sm">
                  <div className="max-w-[180px]">
                    <div className="font-medium truncate">{prod.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {prod.sales} sales • {prod.stock} in stock
                    </div>
                  </div>
                  <span className="font-semibold text-foreground">{prod.price}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

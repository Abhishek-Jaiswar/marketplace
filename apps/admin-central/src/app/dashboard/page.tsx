import React from "react"
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
  StoreIcon,
  UsersIcon,
  ShieldCheckIcon,
  DollarSignIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ArrowUpRightIcon,
  ActivityIcon,
  ClockIcon,
} from "lucide-react"

const pendingSellers = [
  {
    id: "SEL-882",
    storeName: "Apex Tech Gear",
    category: "Electronics",
    email: "contact@apextech.io",
    date: "2 hours ago",
    requestedCommission: "10%",
  },
  {
    id: "SEL-881",
    storeName: "Lumina Home & Goods",
    category: "Home & Kitchen",
    email: "partners@luminahome.com",
    date: "5 hours ago",
    requestedCommission: "12%",
  },
  {
    id: "SEL-880",
    storeName: "VogueThreads Studio",
    category: "Apparel & Fashion",
    email: "support@voguethreads.co",
    date: "1 day ago",
    requestedCommission: "15%",
  },
  {
    id: "SEL-879",
    storeName: "BioNutra Wellness",
    category: "Health & Beauty",
    email: "admin@bionutra.com",
    date: "2 days ago",
    requestedCommission: "10%",
  },
]

const recentAuditLogs = [
  {
    id: 1,
    action: "Approved Merchant Application",
    target: "CyberAudio Labs (SEL-877)",
    actor: "Admin (alex@cbs.com)",
    time: "10 mins ago",
  },
  {
    id: 2,
    action: "Updated Take-Rate Commission",
    target: "Category: Consumer Electronics (8% → 10%)",
    actor: "System Config",
    time: "45 mins ago",
  },
  {
    id: 3,
    action: "Initiated Bulk Seller Payout",
    target: "Batch #2026-07B ($84,200.00)",
    actor: "Admin (sarah@cbs.com)",
    time: "2 hours ago",
  },
]

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Platform Operations & Administration
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor ecosystem GMV, seller approvals, system health, and marketplace metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ActivityIcon className="size-4" />
            Audit Logs
          </Button>
          <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
            <ShieldCheckIcon className="size-4" />
            Approve Pending Sellers
          </Button>
        </div>
      </div>

      {/* KPI Executive Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: GMV */}
        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Gross Volume (GMV)
            </CardTitle>
            <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-600 dark:text-cyan-400">
              <DollarSignIcon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,420,500.00</div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              <span className="font-semibold">+22.4%</span> MoM ecosystem growth
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Active Merchants */}
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Sellers
            </CardTitle>
            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-400">
              <StoreIcon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,842</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              Across <span className="font-medium text-foreground">14 categories</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Pending Approvals */}
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pending Applications
            </CardTitle>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
              <ClockIcon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 Waiting</div>
            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 mt-1">
              Requires KYB & license review
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Platform Take-Rate Revenue */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Platform Take Revenue
            </CardTitle>
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400">
              <ShieldCheckIcon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$142,050.00</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              Effective take-rate: <span className="font-semibold text-foreground">10.0%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Pending Seller Applications Queue (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Seller Application Queue</CardTitle>
              <CardDescription>
                Review seller verification requests before granting storefront access.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary">
              View All Applications
              <ArrowUpRightIcon className="size-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto rounded-lg border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Store Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3">Commission</th>
                    <th className="px-4 py-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pendingSellers.map((seller) => (
                    <tr key={seller.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">
                        <div>{seller.storeName}</div>
                        <div className="text-xs text-muted-foreground">{seller.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{seller.category}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{seller.date}</td>
                      <td className="px-4 py-3 font-semibold">{seller.requestedCommission}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950">
                            <CheckCircle2Icon className="size-3.5" />
                            Approve
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-destructive hover:bg-destructive/10">
                            <XCircleIcon className="size-3.5" />
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: System Health & Platform Audit Trail */}
        <div className="flex flex-col gap-6">
          {/* System Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>System Infrastructure Health</span>
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-normal">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Operational
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Database Clusters</span>
                <span className="font-medium text-foreground">Healthy (3/3 nodes)</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">API Edge Latency</span>
                <span className="font-medium text-foreground">18 ms avg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Monthly Service SLA</span>
                <span className="font-medium text-emerald-600 font-semibold">99.98% Uptime</span>
              </div>
            </CardContent>
          </Card>

          {/* Audit Events Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UsersIcon className="size-4 text-primary" />
                Realtime Platform Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {recentAuditLogs.map((log) => (
                <div key={log.id} className="flex flex-col gap-1 border-b last:border-0 pb-3 last:pb-0 text-xs">
                  <div className="font-semibold text-foreground">{log.action}</div>
                  <div className="text-muted-foreground">{log.target}</div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground/80 mt-1">
                    <span>{log.actor}</span>
                    <span>{log.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
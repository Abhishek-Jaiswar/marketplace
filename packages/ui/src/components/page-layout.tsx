import type { ReactNode } from "react"

import { cn } from "@workspace/ui/lib/utils"

export interface PageHeaderProps {
  title: string
  description?: string
  /** Page-level actions, aligned to the end of the row. */
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-semibold type-display">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-prose text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex gap-2">{actions}</div> : null}
    </header>
  )
}

export interface Metric {
  label: string
  value: ReactNode
}

export function MetricList({
  metrics,
  className,
}: {
  metrics: Metric[]
  className?: string
}) {
  return (
    <dl
      className={cn(
        "grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:auto-cols-fr sm:grid-flow-col",
        className
      )}
    >
      {metrics.map((metric) => (
        <div key={metric.label} className="bg-card p-4">
          <dt className="text-muted-foreground">{metric.label}</dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums">
            {metric.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export interface QueueSplitProps {
  queue: ReactNode
  /** The selected item. Stacks under the queue on small screens. */
  detail: ReactNode
  className?: string
}

/** A work queue beside the decision for the selected item. */
export function QueueSplit({ queue, detail, className }: QueueSplitProps) {
  return (
    <div
      className={cn(
        "grid overflow-hidden rounded-lg border border-border bg-card md:grid-cols-[20rem_1fr]",
        className
      )}
    >
      <div className="max-h-[32rem] overflow-y-auto border-b border-border md:max-h-none md:border-r md:border-b-0">
        {queue}
      </div>
      <div className="min-w-0 p-4">{detail}</div>
    </div>
  )
}

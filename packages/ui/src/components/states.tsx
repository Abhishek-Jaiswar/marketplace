import type { ReactNode } from "react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

export interface EmptyStateProps {
  title: string
  description?: string
  /** The next step, usually a button or link. */
  action?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-start gap-1 p-6", className)}>
      <p className="font-semibold">{title}</p>
      {description ? (
        <p className="max-w-prose text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}

export interface ErrorStateProps {
  /** What failed and how to recover. */
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ message, onRetry, className }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn("flex flex-wrap items-center gap-3 p-6", className)}
    >
      <p>{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}

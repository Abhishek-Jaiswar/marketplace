import { cn } from "@workspace/ui/lib/utils"

const tones = {
  neutral: "bg-muted text-muted-foreground",
  progress: "bg-accent text-accent-foreground",
  attention: "bg-warning-soft text-foreground",
  success: "bg-success-soft text-success",
  danger: "bg-destructive-soft text-destructive",
} as const

type Tone = keyof typeof tones

/** Every status the API can return, in one vocabulary across all surfaces. */
const statuses: Record<string, { label: string; tone: Tone }> = {
  // Sellers and verification
  DRAFT: { label: "Draft", tone: "neutral" },
  DOCUMENTS_PENDING: { label: "Documents needed", tone: "attention" },
  UNDER_REVIEW: { label: "In review", tone: "progress" },
  PENDING_REVIEW: { label: "In review", tone: "progress" },
  PENDING: { label: "Pending", tone: "attention" },
  APPROVED: { label: "Approved", tone: "success" },
  REJECTED: { label: "Rejected", tone: "danger" },
  SUSPENDED: { label: "Suspended", tone: "danger" },
  // Catalog and listings
  ARCHIVED: { label: "Archived", tone: "neutral" },
  ACTIVE: { label: "Active", tone: "success" },
  INACTIVE: { label: "Inactive", tone: "neutral" },
  OUT_OF_STOCK: { label: "Out of stock", tone: "danger" },
  DISCONTINUED: { label: "Discontinued", tone: "neutral" },
  // Orders
  PENDING_PAYMENT: { label: "Awaiting payment", tone: "attention" },
  PAYMENT_FAILED: { label: "Payment failed", tone: "danger" },
  PLACED: { label: "Placed", tone: "progress" },
  NEW: { label: "New", tone: "attention" },
  ACCEPTED: { label: "Accepted", tone: "progress" },
  PACKED: { label: "Packed", tone: "progress" },
  SHIPPED: { label: "Shipped", tone: "progress" },
  DELIVERED: { label: "Delivered", tone: "success" },
  COMPLETED: { label: "Completed", tone: "success" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
  // Returns and money
  REQUESTED: { label: "Requested", tone: "attention" },
  RETURN_REQUESTED: { label: "Return requested", tone: "attention" },
  PICKUP_SCHEDULED: { label: "Pickup scheduled", tone: "progress" },
  PICKED_UP: { label: "Picked up", tone: "progress" },
  RECEIVED: { label: "Received", tone: "progress" },
  RETURNED: { label: "Returned", tone: "neutral" },
  REFUNDED: { label: "Refunded", tone: "neutral" },
  PROCESSING: { label: "Processing", tone: "progress" },
  PAID: { label: "Paid", tone: "success" },
  SUCCEEDED: { label: "Refunded", tone: "success" },
  FAILED: { label: "Failed", tone: "danger" },
  ON_HOLD: { label: "On hold", tone: "attention" },
}

const humanize = (status: string) =>
  status.charAt(0) + status.slice(1).toLowerCase().replaceAll("_", " ")

export interface StatusPillProps {
  status: string
  className?: string
}

export function StatusPill({ status, className }: StatusPillProps) {
  const { label, tone } = statuses[status] ?? {
    label: humanize(status),
    tone: "neutral" as const,
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-1.5 py-0.5 text-sm font-medium whitespace-nowrap",
        tones[tone],
        className
      )}
    >
      {label}
    </span>
  )
}

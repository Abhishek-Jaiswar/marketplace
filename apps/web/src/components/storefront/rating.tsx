import { StarIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

import { mockRating } from "../../lib/mock-data"

export function RatingPill({
  rating,
  className,
}: {
  rating: number
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-sm bg-tint-sky px-1 text-xs font-semibold tabular-nums",
        className
      )}
    >
      {rating.toFixed(1)}
      <StarIcon className="size-3 fill-current" aria-hidden="true" />
    </span>
  )
}

export function RatingLine({ slug }: { slug: string }) {
  const { rating, count } = mockRating(slug)

  return (
    <span className="mt-1 flex items-center gap-1.5">
      <RatingPill rating={rating} />
      <span className="text-xs text-muted-foreground tabular-nums">
        ({count.toLocaleString("en-IN")})
      </span>
    </span>
  )
}

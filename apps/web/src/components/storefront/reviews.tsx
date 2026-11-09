import {
  mockRating,
  mockRatingBreakdown,
  mockReviews,
} from "../../lib/mock-data"
import { Panel } from "./catalog"
import { RatingPill } from "./rating"

const STAR_LEVELS = [5, 4, 3, 2, 1]

export function ReviewsPanel({ slug }: { slug: string }) {
  const { rating, count } = mockRating(slug)
  const breakdown = mockRatingBreakdown(rating)

  return (
    <Panel title="Ratings and reviews">
      <div className="grid gap-6 md:grid-cols-[16rem_minmax(0,1fr)]">
        <div>
          <p className="text-3xl font-bold tabular-nums">{rating.toFixed(1)}</p>
          <p className="text-sm text-muted-foreground tabular-nums">
            {count.toLocaleString("en-IN")} ratings
          </p>
          <ul className="mt-3 space-y-1">
            {STAR_LEVELS.map((level, index) => (
              <li key={level} className="flex items-center gap-2 text-sm">
                <span className="w-3 tabular-nums">{level}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${breakdown[index]}%` }}
                  />
                </span>
                <span className="w-8 text-right text-muted-foreground tabular-nums">
                  {breakdown[index]}%
                </span>
              </li>
            ))}
          </ul>
        </div>
        <ul className="divide-y divide-border">
          {mockReviews(slug).map((review) => (
            <li key={review.name} className="py-3 first:pt-0">
              <p className="flex items-center gap-2">
                <RatingPill rating={review.rating} />
                <span className="font-semibold">{review.title}</span>
              </p>
              <p className="mt-1 max-w-prose">{review.body}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {review.name}, {review.date}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}

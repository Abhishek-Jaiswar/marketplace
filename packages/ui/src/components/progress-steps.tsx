import { CheckIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

export interface StepperProps {
  steps: string[]
  /** Zero-based index of the step in progress. */
  current: number
  className?: string
}

/** Progress through a task the user is completing, such as onboarding. */
export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <ol className={cn("flex flex-wrap gap-x-6 gap-y-2", className)}>
      {steps.map((step, index) => {
        const isDone = index < current
        const isCurrent = index === current

        return (
          <li
            key={step}
            aria-current={isCurrent ? "step" : undefined}
            className="flex items-center gap-2"
          >
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full border text-sm font-semibold tabular-nums",
                isDone && "border-primary bg-primary text-primary-foreground",
                isCurrent && "border-primary text-foreground",
                !isDone && !isCurrent && "text-muted-foreground"
              )}
            >
              {isDone ? <CheckIcon className="size-4" /> : index + 1}
            </span>
            <span
              className={cn(
                isCurrent ? "font-semibold" : "text-muted-foreground"
              )}
            >
              {step}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export interface TimelineEvent {
  title: string
  detail?: string
  time?: string
}

/** What happened, newest first, such as order or shipment tracking. */
export function Timeline({
  events,
  className,
}: {
  events: TimelineEvent[]
  className?: string
}) {
  return (
    <ol className={className}>
      {events.map((event, index) => (
        <li key={`${event.title}-${index}`} className="flex gap-3">
          <span className="flex flex-col items-center" aria-hidden="true">
            <span
              className={cn(
                "mt-1.5 size-2.5 rounded-full",
                index === 0 ? "bg-primary" : "bg-input"
              )}
            />
            {index < events.length - 1 ? (
              <span className="w-px flex-1 bg-border" />
            ) : null}
          </span>
          <div className="pb-4">
            <p className={cn(index === 0 && "font-semibold")}>{event.title}</p>
            {event.detail ? (
              <p className="text-muted-foreground">{event.detail}</p>
            ) : null}
            {event.time ? (
              <p className="text-sm text-muted-foreground">{event.time}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}

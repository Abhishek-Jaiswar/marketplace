import type { HTMLAttributes } from "react"

import { brand } from "@workspace/ui/lib/brand"
import { cn } from "@workspace/ui/lib/utils"

const sizes = {
  sm: { mark: "size-5", name: "text-base", descriptor: "text-xs" },
  md: { mark: "size-7", name: "text-xl", descriptor: "text-xs" },
  lg: { mark: "size-10", name: "text-2xl", descriptor: "text-sm" },
  xl: { mark: "size-16", name: "text-5xl", descriptor: "text-lg" },
} as const

const tones = {
  ink: { name: "text-foreground", descriptor: "text-muted-foreground" },
  inverse: { name: "text-white", descriptor: "text-inverse-muted" },
} as const

export interface LogoMarkProps {
  className?: string
}

/** The price-tag symbol alone. It has no letters, so it survives a rename. */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <path
        fill="var(--action)"
        d="M12 3h15a2 2 0 0 1 2 2v22a2 2 0 0 1-2 2H12a2 2 0 0 1-1.5-.7l-7.3-11a2 2 0 0 1 0-2.6l7.3-11A2 2 0 0 1 12 3Z"
      />
      <circle cx="10.5" cy="16" r="2.25" fill="var(--foreground)" />
      <rect x="16" y="10" width="9" height="2.25" fill="var(--foreground)" />
      <rect x="16" y="15.5" width="9" height="6.5" fill="var(--foreground)" />
    </svg>
  )
}

export interface LogoProps extends HTMLAttributes<HTMLSpanElement> {
  /** `full` is symbol and name, `mark` the symbol, `name` the wordmark. */
  variant?: "full" | "mark" | "name"
  orientation?: "horizontal" | "vertical"
  size?: keyof typeof sizes
  /** Use `inverse` on dark backgrounds. */
  tone?: keyof typeof tones
  /** Overrides the configured brand name. */
  name?: string
  /** Product line under the name, such as "Seller Central". */
  descriptor?: string
}

export function Logo({
  variant = "full",
  orientation = "horizontal",
  size = "md",
  tone = "ink",
  name = brand.name,
  descriptor,
  className,
  ...props
}: LogoProps) {
  const scale = sizes[size]
  const colors = tones[tone]
  const isVertical = orientation === "vertical"

  return (
    <span
      role="img"
      aria-label={descriptor ? `${name} ${descriptor}` : name}
      className={cn(
        "inline-flex select-none",
        isVertical
          ? "flex-col items-center gap-1.5 text-center"
          : "items-center gap-2",
        className
      )}
      {...props}
    >
      {variant !== "name" ? <LogoMark className={scale.mark} /> : null}
      {variant !== "mark" ? (
        <span className="flex flex-col">
          <span
            className={cn(
              "leading-none font-extrabold",
              scale.name,
              colors.name
            )}
            style={{ fontStretch: "125%" }}
          >
            {name}
          </span>
          {descriptor ? (
            <span
              className={cn(
                "mt-1 leading-none",
                scale.descriptor,
                colors.descriptor
              )}
            >
              {descriptor}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  )
}

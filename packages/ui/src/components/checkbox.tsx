"use client"

import type { ComponentProps, ReactNode } from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

export interface CheckboxProps extends ComponentProps<
  typeof CheckboxPrimitive.Root
> {
  children?: ReactNode
}

export function Checkbox({ className, children, ...props }: CheckboxProps) {
  return (
    <label className={cn("inline-flex items-center gap-2", className)}>
      <CheckboxPrimitive.Root
        className="flex size-5 shrink-0 items-center justify-center rounded-sm border border-input bg-card data-checked:border-primary data-checked:bg-primary data-disabled:bg-muted"
        {...props}
      >
        <CheckboxPrimitive.Indicator className="text-primary-foreground">
          <CheckIcon className="size-4" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {children}
    </label>
  )
}

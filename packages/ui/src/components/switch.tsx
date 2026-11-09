"use client"

import type { ComponentProps, ReactNode } from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@workspace/ui/lib/utils"

export interface SwitchProps extends ComponentProps<
  typeof SwitchPrimitive.Root
> {
  children?: ReactNode
}

export function Switch({ className, children, ...props }: SwitchProps) {
  return (
    <label className={cn("inline-flex items-center gap-2", className)}>
      <SwitchPrimitive.Root
        className="flex h-6 w-10 shrink-0 items-center rounded-full bg-input p-0.5 transition-colors data-checked:bg-primary data-disabled:opacity-50"
        {...props}
      >
        <SwitchPrimitive.Thumb className="size-5 rounded-full bg-card transition-transform data-checked:translate-x-4" />
      </SwitchPrimitive.Root>
      {children}
    </label>
  )
}

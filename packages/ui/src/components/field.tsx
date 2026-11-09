"use client"

import type { ReactNode } from "react"
import { Field as FieldPrimitive } from "@base-ui/react/field"

import { cn } from "@workspace/ui/lib/utils"

export interface FieldProps {
  label: string
  /** Guidance shown under the control until there is an error. */
  hint?: string
  /** Validation message; marks the control invalid when set. */
  error?: string | undefined
  name?: string
  className?: string
  /** An `Input`, `Textarea`, or `Select`. */
  children: ReactNode
}

export function Field({
  label,
  hint,
  error,
  name,
  className,
  children,
}: FieldProps) {
  return (
    <FieldPrimitive.Root
      name={name}
      invalid={Boolean(error)}
      className={cn("flex flex-col gap-1.5", className)}
    >
      <FieldPrimitive.Label className="text-sm font-medium">
        {label}
      </FieldPrimitive.Label>
      {children}
      {error ? (
        <FieldPrimitive.Error match className="text-sm text-destructive">
          {error}
        </FieldPrimitive.Error>
      ) : hint ? (
        <FieldPrimitive.Description className="text-sm text-muted-foreground">
          {hint}
        </FieldPrimitive.Description>
      ) : null}
    </FieldPrimitive.Root>
  )
}

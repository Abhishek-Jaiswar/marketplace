"use client"

import type { ComponentProps } from "react"
import { Field as FieldPrimitive } from "@base-ui/react/field"

import { controlClasses } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <FieldPrimitive.Control
      render={
        <textarea
          className={cn(controlClasses, "min-h-24 py-2", className)}
          {...props}
        />
      }
    />
  )
}

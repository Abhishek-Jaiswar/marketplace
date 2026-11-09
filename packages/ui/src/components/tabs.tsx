"use client"

import type { ComponentProps } from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import { cn } from "@workspace/ui/lib/utils"

export function Tabs(props: ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root {...props} />
}

export function TabsList({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "scrollbar-none flex gap-6 overflow-x-auto border-b border-border",
        className
      )}
      {...props}
    />
  )
}

export function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Tab>) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        "-mb-px border-b-2 border-transparent py-2 whitespace-nowrap text-muted-foreground data-active:border-primary data-active:font-semibold data-active:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export function TabsPanel({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Panel>) {
  return <TabsPrimitive.Panel className={cn("pt-4", className)} {...props} />
}

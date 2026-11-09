"use client"

import { Select as SelectPrimitive } from "@base-ui/react/select"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { controlClasses } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  options: SelectOption[]
  value?: string | null
  defaultValue?: string
  onValueChange?: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  name?: string
  className?: string
  "aria-label"?: string
}

export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select",
  disabled,
  name,
  className,
  "aria-label": ariaLabel,
}: SelectProps) {
  const controlled = value === undefined ? {} : { value }
  const uncontrolled = defaultValue === undefined ? {} : { defaultValue }
  const named = name === undefined ? {} : { name }

  return (
    <SelectPrimitive.Root<string>
      items={[{ value: null, label: placeholder }, ...options]}
      disabled={disabled ?? false}
      {...controlled}
      {...uncontrolled}
      {...named}
      {...(onValueChange ? { onValueChange } : {})}
    >
      <SelectPrimitive.Trigger
        aria-label={ariaLabel}
        className={cn(
          controlClasses,
          "flex h-10 items-center justify-between gap-2 text-left",
          className
        )}
      >
        <SelectPrimitive.Value />
        <SelectPrimitive.Icon>
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          sideOffset={4}
          alignItemWithTrigger={false}
          className="z-50"
        >
          <SelectPrimitive.Popup className="max-h-72 min-w-(--anchor-width) overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg">
            <SelectPrimitive.List>
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="flex cursor-default items-center justify-between gap-4 rounded-sm px-2 py-1.5 outline-none select-none data-highlighted:bg-accent"
                >
                  <SelectPrimitive.ItemText>
                    {option.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <CheckIcon className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { SlidersHorizontalIcon } from "lucide-react"
import { Sheet, SheetContent, SheetTitle } from "@workspace/ui/components/sheet"
import { cn } from "@workspace/ui/lib/utils"

export interface FilterOption {
  label: string
  href: string
  active: boolean
}

export interface FilterGroup {
  title: string
  options: FilterOption[]
}

export function FilterSheet({ groups }: { groups: FilterGroup[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-primary px-4 text-primary-foreground"
      >
        <SlidersHorizontalIcon className="size-4" aria-hidden="true" />
        Filter and sort
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85dvh] rounded-t-2xl">
          <div className="mx-auto w-full max-w-2xl overflow-y-auto p-4 pb-8 text-base">
            <SheetTitle className="text-xl font-semibold">
              Filter and sort
            </SheetTitle>
            {groups.map((group) => (
              <section key={group.title} className="mt-5">
                <h3 className="font-medium">{group.title}</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {group.options.map((option) => (
                    <li key={option.label}>
                      <Link
                        href={option.href}
                        onClick={() => setOpen(false)}
                        aria-current={option.active ? "true" : undefined}
                        className={cn(
                          "block rounded-full px-4 py-2",
                          option.active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-accent"
                        )}
                      >
                        {option.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

"use client"

import * as React from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { ChevronDownIcon, ArrowUpRightIcon } from "lucide-react"

export interface SidebarNavItem {
  title: string
  url: string
  icon?: React.ReactNode
  isActive?: boolean
  badge?: string | number
  badgeColor?: "red" | "muted" | "brand"
  isExternal?: boolean
  items?: {
    title: string
    url: string
    icon?: React.ReactNode
    badge?: string | number
    isActive?: boolean
  }[]
}

export interface SidebarNavGroup {
  groupTitle?: string
  items: SidebarNavItem[]
}

// Helper to render Lucide icon with forced 16px sizing and margin
function RenderIcon({
  icon,
  className = "size-4 shrink-0 text-foreground/70",
}: {
  icon?: React.ReactNode
  className?: string
}) {
  if (!icon) return null
  if (React.isValidElement(icon)) {
    return React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
      className: `size-4 shrink-0 ${className} ${(icon.props as { className?: string }).className || ""}`,
    })
  }
  return <span className={`size-4 shrink-0 flex items-center justify-center ${className}`}>{icon}</span>
}

function isUrlActive(url: string, pathname: string): boolean {
  if (!url || !pathname) return false
  const cleanUrl = url.split("?")[0]
  if (cleanUrl === "/dashboard") {
    return pathname === "/dashboard"
  }
  return pathname === cleanUrl || pathname.startsWith(cleanUrl + "/")
}

export function NavMain({
  groups,
  items,
  currentPath,
}: {
  groups?: SidebarNavGroup[]
  items?: SidebarNavItem[]
  currentPath?: string
}) {
  const [mountedPath, setMountedPath] = React.useState(currentPath || "")

  React.useEffect(() => {
    if (currentPath) {
      setMountedPath(currentPath)
    } else if (typeof window !== "undefined") {
      setMountedPath(window.location.pathname)
    }
  }, [currentPath])

  const activePath = currentPath || mountedPath
  const navGroups: SidebarNavGroup[] = groups || (items ? [{ items }] : [])

  return (
    <div className="flex flex-col gap-4 py-1 select-none">
      {navGroups.map((group, index) => (
        <SidebarGroup key={group.groupTitle || index} className="p-0">
          {group.groupTitle && (
            <SidebarGroupLabel className="flex items-center justify-between px-2.5 pb-1.5 text-[11px] font-semibold text-muted-foreground/70 tracking-wider uppercase">
              <span>{group.groupTitle}</span>
              <ChevronDownIcon className="size-3 text-muted-foreground/50" />
            </SidebarGroupLabel>
          )}

          <SidebarMenu className="gap-1">
            {group.items.map((item) => {
              const hasSubItems = item.items && item.items.length > 0
              const itemIsActive = item.isActive || isUrlActive(item.url, activePath)
              const childIsActive = item.items?.some((sub) => sub.isActive || isUrlActive(sub.url, activePath))
              const shouldBeOpen = Boolean(itemIsActive || childIsActive)

              // Parent without sub-items (Single Link)
              if (!hasSubItems) {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={
                        <a
                          href={item.url}
                          {...(item.isExternal
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        />
                      }
                      tooltip={item.title}
                      isActive={itemIsActive}
                      className={`group relative flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium transition-all ${
                        itemIsActive
                          ? "bg-slate-200/80 text-foreground font-semibold dark:bg-slate-800/80 shadow-2xs"
                          : "text-foreground/80 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-foreground"
                      }`}
                    >
                      <RenderIcon
                        icon={item.icon}
                        className={`size-4 ${
                          itemIsActive
                            ? "text-foreground font-bold"
                            : "text-foreground/80 group-hover:text-foreground"
                        }`}
                      />
                      <span className="flex-1 truncate">{item.title}</span>

                      {item.badge !== undefined && (
                        <span
                          className={`inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold leading-none ${
                            item.badgeColor === "red"
                              ? "bg-red-500 text-white shadow-2xs"
                              : item.badgeColor === "brand"
                              ? "bg-primary text-primary-foreground font-bold"
                              : "bg-muted text-muted-foreground/80 font-normal"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {item.isExternal && (
                        <ArrowUpRightIcon className="size-3.5 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              }

              // Parent with sub-items (Collapsible Container)
              return (
                <CollapsibleNavItem
                  key={item.title}
                  item={item}
                  activePath={activePath}
                  shouldBeOpen={shouldBeOpen}
                  itemIsActive={itemIsActive}
                />
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </div>
  )
}

function CollapsibleNavItem({
  item,
  activePath,
  shouldBeOpen,
  itemIsActive,
}: {
  item: SidebarNavItem
  activePath: string
  shouldBeOpen: boolean
  itemIsActive: boolean
}) {
  const [isOpen, setIsOpen] = React.useState(shouldBeOpen)

  // Keep active collapsible open always when route matches child/parent
  React.useEffect(() => {
    if (shouldBeOpen) {
      setIsOpen(true)
    }
  }, [shouldBeOpen])

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group/collapsible"
      render={<SidebarMenuItem />}
    >
      <CollapsibleTrigger
        render={
          <SidebarMenuButton
            tooltip={item.title}
            className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors ${
              itemIsActive
                ? "bg-slate-200/80 text-foreground font-semibold dark:bg-slate-800/80 shadow-2xs"
                : "text-foreground/90 hover:bg-slate-100 dark:hover:bg-slate-800/40"
            }`}
          />
        }
      >
        <RenderIcon
          icon={item.icon}
          className={`size-4 ${itemIsActive ? "text-foreground font-bold" : "text-foreground/80"}`}
        />
        <span className="flex-1 text-left font-medium truncate">{item.title}</span>
        <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-open/collapsible:rotate-180 text-muted-foreground/70" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-4 border-l-2 border-slate-200/80 dark:border-slate-800/80 pl-3.5 my-1 flex flex-col gap-0.5">
          {item.items?.map((subItem) => {
            const subIsActive = subItem.isActive || isUrlActive(subItem.url, activePath)
            return (
              <a
                key={subItem.title}
                href={subItem.url}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                  subIsActive
                    ? "font-semibold text-foreground bg-slate-200/70 dark:bg-slate-800/70 shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
                }`}
              >
                {subItem.icon ? (
                  <RenderIcon icon={subItem.icon} className="size-3.5 text-foreground/70" />
                ) : (
                  <span className="size-3.5 shrink-0" />
                )}
                <span className="flex-1 truncate">{subItem.title}</span>
                {subItem.badge !== undefined && (
                  <span className="text-[11px] font-medium text-muted-foreground/70">
                    {subItem.badge}
                  </span>
                )}
              </a>
            )
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

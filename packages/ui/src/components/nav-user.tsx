"use client"

import * as React from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import { ChevronsUpDownIcon, BadgeCheckIcon, CreditCardIcon, BellIcon, LogOutIcon } from "lucide-react"

export interface UserMenuItem {
  label: string
  href?: string
  icon?: React.ReactNode
  onClick?: () => void
}

export interface NavUserProps {
  user: {
    name: string
    email: string
    avatar: string
  }
  items?: UserMenuItem[]
  onLogout?: () => void
}

const defaultUserMenuItems: UserMenuItem[] = [
  {
    label: "Account Settings",
    href: "/dashboard/settings",
    icon: <BadgeCheckIcon className="size-3.5 text-muted-foreground" />,
  },
  {
    label: "Billing & Payouts",
    href: "/dashboard/billing",
    icon: <CreditCardIcon className="size-3.5 text-muted-foreground" />,
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: <BellIcon className="size-3.5 text-muted-foreground" />,
  },
]

export function NavUser({
  user,
  items,
  onLogout,
}: NavUserProps) {
  const { isMobile } = useSidebar()
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "US"

  const menuItems = items && items.length > 0 ? items : defaultUserMenuItems

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="w-full justify-start gap-2.5 rounded-xl px-2.5 py-2 hover:bg-slate-200/60 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              />
            }
          >
            <Avatar className="size-8 rounded-full border border-slate-200 dark:border-slate-800">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-full bg-slate-200 text-slate-800 font-bold text-xs dark:bg-slate-800 dark:text-slate-200">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-xs leading-snug">
              <span className="truncate font-bold text-foreground">
                {user.name}
              </span>
              <span className="truncate text-[11px] text-muted-foreground/80 font-normal">
                {user.email}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-3.5 text-muted-foreground/60" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 rounded-xl p-1.5 shadow-xl border-slate-200 dark:border-slate-800"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2.5 px-2.5 py-2 text-left text-xs bg-slate-100 dark:bg-slate-800/60 rounded-lg">
                  <Avatar className="size-8 rounded-full">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-full bg-slate-200 text-slate-800 font-bold text-xs dark:bg-slate-700 dark:text-slate-200">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-xs leading-snug">
                    <span className="truncate font-bold">{user.name}</span>
                    <span className="truncate text-[11px] text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuGroup>
              {menuItems.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  render={item.href ? <a href={item.href} /> : undefined}
                  onClick={item.onClick}
                  className="gap-2 text-xs py-2 rounded-lg cursor-pointer"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={onLogout}
              className="gap-2 text-xs py-2 rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
            >
              <LogOutIcon className="size-3.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}


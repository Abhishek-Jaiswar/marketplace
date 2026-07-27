"use client"

import * as React from "react"
import { NavMain, SidebarNavGroup, SidebarNavItem } from "@workspace/ui/components/nav-main"
import { NavUser } from "@workspace/ui/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import { StoreIcon, ChevronsLeftIcon } from "lucide-react"

export interface SidebarData {
  appName?: string
  appSubtitle?: string
  appLogo?: React.ReactNode
  groups?: SidebarNavGroup[]
  navMain?: SidebarNavItem[]
  bottomItems?: SidebarNavItem[]
  user?: {
    name: string
    email: string
    avatar: string
  }
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data?: SidebarData
}

const defaultData: SidebarData = {
  appName: "CBS Marketplace",
  appSubtitle: "cbs-marketplace.studio",
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <StoreIcon className="size-4" />,
      isActive: true,
    },
  ],
}

export function AppSidebar({ data = defaultData, ...props }: AppSidebarProps) {
  const { toggleSidebar } = useSidebar()

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200/60 bg-[#f8f9fc] dark:bg-[#0d0f14] dark:border-slate-800/60 font-sans"
      {...props}
    >
      {/* Header Section */}
      {data.appName && (
        <SidebarHeader className="pt-4 pb-2 px-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center justify-between gap-2 w-full">
                <SidebarMenuButton
                  size="lg"
                  className="flex-1 hover:bg-slate-200/50 dark:hover:bg-slate-800/40 rounded-xl transition-colors p-1.5"
                >
                  <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xs">
                    {data.appLogo || <StoreIcon className="size-4" />}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight pl-1">
                    <span className="truncate font-bold tracking-tight text-foreground">
                      {data.appName}
                    </span>
                    {data.appSubtitle && (
                      <span className="truncate text-[11px] font-medium text-muted-foreground/70">
                        {data.appSubtitle}
                      </span>
                    )}
                  </div>
                </SidebarMenuButton>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      )}

      {/* Main Navigation Content */}
      <SidebarContent className="px-3 py-2 scrollbar-none">
        <NavMain groups={data.groups} items={data.navMain} />

        {/* Bottom Utility Items */}
        {data.bottomItems && data.bottomItems.length > 0 && (
          <div className="mt-auto pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <NavMain items={data.bottomItems} />
          </div>
        )}
      </SidebarContent>

      {/* Footer User Profile */}
      {data.user && (
        <SidebarFooter className="p-3 pt-2">
          <NavUser user={data.user} />
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  )
}

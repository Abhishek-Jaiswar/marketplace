"use client"

import * as React from "react"
import {
  NavMain,
  SidebarNavGroup,
  SidebarNavItem,
} from "@workspace/ui/components/nav-main"
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
import { StoreIcon } from "lucide-react"

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
  onLogout?: () => void
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

export function AppSidebar({ data = defaultData, onLogout, ...props }: AppSidebarProps) {
  const { toggleSidebar } = useSidebar()

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200/60 bg-[#f8f9fc] font-sans dark:border-slate-800/60 dark:bg-[#0d0f14]"
      {...props}
    >
      {/* Header Section */}
      {data.appName && (
        <SidebarHeader className="px-3 pt-4 pb-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex w-full items-center justify-between gap-2">
                <SidebarMenuButton
                  size="lg"
                  className="flex-1 rounded-xl p-1.5 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-800/40"
                >
                  <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xs">
                    {data.appLogo || <StoreIcon className="size-4" />}
                  </div>
                  <div className="grid flex-1 pl-1 text-left text-sm leading-tight">
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
      <SidebarContent className="scrollbar-none px-3 py-2">
        <NavMain groups={data.groups} items={data.navMain} />

        {/* Bottom Utility Items */}
        {data.bottomItems && data.bottomItems.length > 0 && (
          <div className="mt-auto border-t border-slate-200/60 pt-4 dark:border-slate-800/60">
            <NavMain items={data.bottomItems} />
          </div>
        )}
      </SidebarContent>

      {/* Footer User Profile */}
      {data.user && (
        <SidebarFooter className="p-3 pt-2">
          <NavUser user={data.user} onLogout={onLogout} />
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  )
}

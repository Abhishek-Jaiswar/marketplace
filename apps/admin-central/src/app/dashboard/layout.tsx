"use client"

import React from "react"
import { useRouter } from "next/navigation"
import {
  useAppSelector,
  useGetMeQuery,
  useLogoutMutation,
} from "@workspace/store"
import { AppSidebar } from "@workspace/ui/components/app-sidebar"
import { adminSidebarData } from "@/config/sidebar-data"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Separator } from "@workspace/ui/components/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { user: cachedUser } = useAppSelector((state) => state.auth)
  const { data: userData } = useGetMeQuery()
  const [logout] = useLogoutMutation()

  const user = userData?.user || cachedUser

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const sidebarUser = user
    ? {
        name: user.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : "Admin Account",
        email: user.email,
        avatar: "https://placehold.net/avatar-5.png",
      }
    : {
        name: "Admin Account",
        email: "Loading...",
        avatar: "https://placehold.net/avatar-5.png",
      }

  const sidebarData = {
    ...adminSidebarData,
    user: sidebarUser,
  }

  return (
    <SidebarProvider>
      <AppSidebar data={sidebarData} onLogout={handleLogout} />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800/80 bg-background/80 backdrop-blur-md px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 bg-slate-200 dark:bg-slate-800"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href="/dashboard"
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Admin Central
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs font-semibold text-foreground">
                    Operations Overview
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout

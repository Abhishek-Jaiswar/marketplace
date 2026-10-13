"use client"

import React from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  useAppSelector,
  useGetMeQuery,
  useGetSellerMeQuery,
  useLogoutMutation,
} from "@workspace/store"
import { AppSidebar } from "@workspace/ui/components/app-sidebar"
import { sellerSidebarData } from "@/config/sidebar-data"
import { getSellerOnboardingRedirect } from "@/lib/onboarding"
import DashboardLoading from "./loading"
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
  const pathname = usePathname()
  const { user: cachedUser } = useAppSelector((state) => state.auth)
  const { data: userData, isLoading: userLoading } = useGetMeQuery()
  const { data: sellerData, isLoading: sellerLoading } = useGetSellerMeQuery(
    undefined,
    {
      skip: !userData?.user,
    }
  )
  const [logout] = useLogoutMutation()

  const user = userData?.user || cachedUser

  // Onboarding Guard: Redirect to pending onboarding step if incomplete
  React.useEffect(() => {
    if (!userLoading && !userData?.user) {
      router.push("/login")
      return
    }
    if (!userLoading && !sellerLoading && userData?.user) {
      const redirectTarget = getSellerOnboardingRedirect(sellerData?.seller)
      if (redirectTarget) {
        router.push(redirectTarget)
      }
    }
  }, [userData, userLoading, sellerData, sellerLoading, router])

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
          : "Seller Account",
        email: user.email,
        avatar: "https://placehold.net/avatar-5.png",
      }
    : {
        name: "Seller Account",
        email: "Loading...",
        avatar: "https://placehold.net/avatar-5.png",
      }

  const sidebarData = {
    ...sellerSidebarData,
    user: sidebarUser,
  }

  return (
    <SidebarProvider>
      <AppSidebar data={sidebarData} onLogout={handleLogout} currentPath={pathname} />
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
                    Seller Central
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs font-semibold text-foreground">
                    Dashboard Overview
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6">
          <React.Suspense fallback={<DashboardLoading />}>
            {children}
          </React.Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout

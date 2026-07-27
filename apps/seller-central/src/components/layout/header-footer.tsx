"use client"

import React from "react"
import { usePathname } from "next/navigation"
import Header from "../nav/header"
import Footer from "../footer/footer"

const HeaderFooter = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  // Standalone pages: no header/footer
  const isStandalone =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/verify-otp"

  // Onboard page has its own custom header and no footer
  const isOnboard = pathname === "/onboard"

  const isDashboard = pathname.startsWith("/dashboard")

  if (isDashboard) {
    return children
  }

  return (
    <div className="flex min-h-screen flex-col">
      {!isStandalone && !isOnboard && <Header />}
      <div className="flex flex-1 flex-col">{children}</div>
      {!isStandalone && !isOnboard && <Footer />}
    </div>
  )
}

export default HeaderFooter

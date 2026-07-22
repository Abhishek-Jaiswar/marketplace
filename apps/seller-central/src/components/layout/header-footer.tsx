"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "../nav/header";
import Footer from "../footer/footer";

const HeaderFooter = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Standalone pages: no header/footer
  const isStandalone =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/verify-otp";

  // Onboard page has its own custom header and no footer
  const isOnboard = pathname === "/onboard";

  return (
    <div className="flex flex-col min-h-screen">
      {!isStandalone && !isOnboard && <Header />}
      <div className="flex-1 flex flex-col">{children}</div>
      {!isStandalone && !isOnboard && <Footer />}
    </div>
  );
};

export default HeaderFooter;
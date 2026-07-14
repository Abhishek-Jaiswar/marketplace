import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import StoreProvider from "./StoreProvider"
import "./globals.css"
import HeaderFooter from "@/components/layout/header-footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "CBS Seller Central - Sell on CBS Marketplace",
  description: "Register and onboard as a seller on CBS Marketplace.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isDasbboard = "";
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <StoreProvider>
          <HeaderFooter>{children}</HeaderFooter>
        </StoreProvider>
      </body>
    </html>
  )
}

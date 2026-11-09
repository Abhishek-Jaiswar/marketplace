import type { Metadata } from "next"
import { Anek_Latin } from "next/font/google"
import { brand } from "@workspace/ui/lib/brand"
import StoreProvider from "./StoreProvider"
import "./globals.css"
import HeaderFooter from "@/components/layout/header-footer"

// The rupee sign is in latin-ext; without it prices fall back to another font.
const anek = Anek_Latin({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-anek",
  display: "swap",
})

export const metadata: Metadata = {
  title: `${brand.sellerProductName} | ${brand.marketplaceName}`,
  description: `Register and sell on ${brand.marketplaceName}.`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${anek.variable} antialiased`}
      data-surface="seller"
    >
      <body className="flex min-h-full flex-col">
        <StoreProvider>
          <HeaderFooter>{children}</HeaderFooter>
        </StoreProvider>
      </body>
    </html>
  )
}

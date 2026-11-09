import type { Metadata } from "next"
import { Anek_Latin } from "next/font/google"
import { brand } from "@workspace/ui/lib/brand"
import StoreProvider from "./StoreProvider"
import "./globals.css"

// The rupee sign is in latin-ext; without it prices fall back to another font.
const anek = Anek_Latin({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-anek",
  display: "swap",
})

export const metadata: Metadata = {
  title: `${brand.adminProductName} | ${brand.marketplaceName}`,
  description: `Operations console for ${brand.marketplaceName}.`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${anek.variable} h-full antialiased`}
      data-surface="admin"
    >
      <body className="flex min-h-full flex-col">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}

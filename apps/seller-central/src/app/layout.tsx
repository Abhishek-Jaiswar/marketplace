import type { Metadata } from "next"
import { Inter, Lora, IBM_Plex_Mono } from "next/font/google"
import StoreProvider from "./StoreProvider"
import "./globals.css"
import HeaderFooter from "@/components/layout/header-footer"

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontSerif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
})

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ['100', '200', '300', '400', '500', '600', '700'],
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
  const isDasbboard = ""
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <StoreProvider>
          <HeaderFooter>{children}</HeaderFooter>
        </StoreProvider>
      </body>
    </html>
  )
}

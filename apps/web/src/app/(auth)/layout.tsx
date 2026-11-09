import Link from "next/link"
import { Logo } from "@workspace/ui/components/logo"
import { brand } from "@workspace/ui/lib/brand"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex flex-1 flex-col items-center bg-background px-4 py-10">
      <Link href="/" aria-label={`${brand.name} home`} className="mb-6">
        <Logo size="lg" />
      </Link>
      <div className="w-full max-w-sm rounded-lg bg-card p-6">{children}</div>
    </main>
  )
}

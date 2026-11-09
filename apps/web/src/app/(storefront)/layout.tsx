import { SiteFooter, SiteHeader } from "../../components/storefront/header"
import { getCategoryTree } from "../../lib/server-api"

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const departments = await getCategoryTree().catch(() => [])

  return (
    <>
      <SiteHeader departments={departments} />
      <main className="mx-auto w-full max-w-[96rem] flex-1 sm:px-4 sm:pt-3">
        {children}
      </main>
      <SiteFooter departments={departments} />
    </>
  )
}

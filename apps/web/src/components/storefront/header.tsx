import Link from "next/link"
import type { CategoryTreeNode } from "@workspace/store"
import { Logo } from "@workspace/ui/components/logo"
import { brand } from "@workspace/ui/lib/brand"
import { cn } from "@workspace/ui/lib/utils"

import { sellerCentralUrl } from "../../lib/departments"
import { AccountLink } from "./account-link"
import { CartLink } from "./commerce"
import { SearchBox } from "./search-box"

const LAST_MENUS_ALIGN_RIGHT = 3

export function SiteHeader({
  departments,
}: {
  departments: CategoryTreeNode[]
}) {
  return (
    <header className="sticky top-0 z-40">
      <div className="bg-tint-sky">
        <div className="mx-auto flex max-w-[96rem] flex-wrap items-center gap-x-6 gap-y-2 px-3 py-2 sm:px-4">
          <Link href="/" aria-label={`${brand.name} home`}>
            <Logo size="md" />
          </Link>
          <div className="order-last w-full md:order-none md:w-auto md:flex-1">
            <SearchBox departments={departments} />
          </div>
          <div className="ml-auto flex items-center gap-5 md:ml-0">
            <a
              href={sellerCentralUrl}
              className="hidden font-medium whitespace-nowrap hover:underline sm:block"
            >
              Sell on {brand.name}
            </a>
            <CartLink />
            <AccountLink />
          </div>
        </div>
      </div>

      <nav aria-label="Departments" className="bg-card shadow-sm">
        <ul className="mx-auto scrollbar-none flex max-w-[96rem] gap-5 overflow-x-auto px-3 sm:px-4 lg:overflow-visible">
          {departments.map((department, index) => (
            <li key={department.id} className="group relative shrink-0">
              <Link
                href={`/products?category=${department.slug}`}
                className="block py-2 text-sm font-medium whitespace-nowrap hover:underline"
              >
                {department.name}
              </Link>
              {department.children?.length ? (
                <div
                  className={cn(
                    "absolute top-full z-50 hidden w-60 rounded-b-lg bg-popover p-2 shadow-lg lg:group-focus-within:block lg:group-hover:block",
                    index >= departments.length - LAST_MENUS_ALIGN_RIGHT
                      ? "right-0"
                      : "left-0"
                  )}
                >
                  <ul>
                    {department.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/products?category=${child.slug}`}
                          className="block rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export function SiteFooter({
  departments,
}: {
  departments: CategoryTreeNode[]
}) {
  return (
    <footer className="mt-6 bg-tint-wheat">
      <div className="mx-auto grid max-w-[96rem] gap-6 px-3 py-8 sm:grid-cols-[1fr_3fr] sm:px-4">
        <div>
          <Logo size="md" />
          <a href={sellerCentralUrl} className="mt-3 block underline">
            Sell on {brand.name}
          </a>
        </div>
        <nav aria-label="All departments">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 md:grid-cols-4">
            {departments.map((department) => (
              <li key={department.id}>
                <Link
                  href={`/products?category=${department.slug}`}
                  className="hover:underline"
                >
                  {department.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}

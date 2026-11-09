import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { EmptyState } from "@workspace/ui/components/states"

export default function StorefrontNotFound() {
  return (
    <EmptyState
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      title="This page does not exist"
      description="The product or store may have been removed."
      action={
        <Button render={<Link href="/products" />}>Browse products</Button>
      }
    />
  )
}

"use client"

import { ErrorState } from "@workspace/ui/components/states"

export default function StorefrontError({
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <ErrorState
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      message="This page could not be loaded."
      onRetry={() => unstable_retry()}
    />
  )
}

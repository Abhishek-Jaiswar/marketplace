import { Skeleton } from "@workspace/ui/components/skeleton"

export default function StorefrontLoading() {
  return (
    <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-3 sm:gap-3 sm:p-0 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="rounded-lg bg-card p-3">
          <Skeleton className="aspect-square w-full rounded-md" />
          <Skeleton className="mt-3 h-4 w-3/4" />
          <Skeleton className="mt-2 h-5 w-1/2" />
        </div>
      ))}
    </div>
  )
}

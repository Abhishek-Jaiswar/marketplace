import Image from "next/image"
import { PackageIcon } from "lucide-react"

export function ProductImage({
  src,
  alt,
}: {
  src: string | null
  alt: string
}) {
  if (!src) {
    return (
      <span className="flex size-full items-center justify-center bg-muted text-muted-foreground">
        <PackageIcon className="size-8" aria-hidden="true" />
        <span className="sr-only">{alt}</span>
      </span>
    )
  }

  return (
    <span className="relative block size-full">
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="(min-width: 1024px) 25vw, 50vw"
        className="object-cover"
      />
    </span>
  )
}

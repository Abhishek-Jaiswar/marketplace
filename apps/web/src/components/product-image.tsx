import Image from "next/image"
import { PackageIcon } from "lucide-react"

export function ProductImage({
  src,
  alt,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  preload = false,
  eager = false,
}: {
  src: string | null
  alt: string
  sizes?: string
  preload?: boolean
  /** For images visible without scrolling. */
  eager?: boolean
}) {
  if (!src) {
    return (
      <span className="flex size-full items-center justify-center text-muted-foreground">
        <PackageIcon className="size-8" aria-hidden="true" />
        <span className="sr-only">{alt}</span>
      </span>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      {...(eager ? { loading: "eager" as const } : {})}
      className="object-cover"
    />
  )
}

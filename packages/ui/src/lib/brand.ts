const name = process.env.NEXT_PUBLIC_BRAND_NAME?.trim() || "CBS"

/** Change the name here or through NEXT_PUBLIC_BRAND_NAME, not in screens. */
export const brand = {
  name,
  marketplaceName: `${name} Marketplace`,
  sellerProductName: "Seller Central",
  adminProductName: "Admin Central",
} as const

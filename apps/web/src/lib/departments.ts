import type { CategoryTreeNode } from "@workspace/store"

/** Maps any category slug to the top-level department that contains it. */
export function departmentLookup(tree: CategoryTreeNode[]) {
  const rootBySlug = new Map<string, string>()

  const walk = (node: CategoryTreeNode, rootSlug: string) => {
    rootBySlug.set(node.slug, rootSlug)
    node.children?.forEach((child) => walk(child, rootSlug))
  }
  tree.forEach((root) => walk(root, root.slug))

  return (categorySlug: string) => rootBySlug.get(categorySlug) ?? ""
}

export const sellerCentralUrl =
  process.env.NEXT_PUBLIC_SELLER_CENTRAL_URL ?? "http://localhost:3001"

import type { Category } from "@workspace/db"

export interface CategoryTreeNode extends Category {
  children?: CategoryTreeNode[] | undefined
}

export interface CreateCategoryInput {
  name: string
  slug?: string | undefined
  excerpt?: string | null | undefined
  image: string
  storageKey: string
  altText: string
  isActive?: boolean | undefined
  parentId?: string | null | undefined
}

export interface UpdateCategoryInput {
  name?: string | undefined
  slug?: string | undefined
  excerpt?: string | null | undefined
  image?: string | undefined
  storageKey?: string | undefined
  altText?: string | undefined
  isActive?: boolean | undefined
  parentId?: string | null | undefined
}

export interface ListCategoriesQuery {
  page?: number | undefined
  limit?: number | undefined
  search?: string | undefined
  parentId?: string | null | undefined
  isActive?: boolean | undefined
}

export interface CategoryParentInfo {
  id: string
  name: string
  slug: string
}

export interface Category {
  id: string
  slug: string
  name: string
  excerpt: string | null
  image: string
  storageKey: string
  altText: string
  isActive: boolean
  parentId: string | null
  parent?: CategoryParentInfo | null
  children?: Partial<Category>[]
  _count?: {
    children: number
  }
  createdAt: string
  updatedAt: string
}

export interface CategoryTreeNode extends Category {
  children?: CategoryTreeNode[]
}

export interface GetCategoryTreeParams {
  includeInactive?: boolean
}

export interface GetCategoryTreeResponse {
  data: CategoryTreeNode[]
}

export interface ListCategoriesParams {
  page?: number
  limit?: number
  search?: string
  parentId?: string | null
  isActive?: boolean
}

export interface ListCategoriesResponse {
  items: Category[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface GetCategoryByIdResponse {
  data: Category
}

export interface GetCategoryBySlugResponse {
  data: Category
}

export interface CreateCategoryRequest {
  name: string
  slug?: string
  excerpt?: string | null
  image: string
  storageKey: string
  altText: string
  isActive?: boolean
  parentId?: string | null
}

export interface CreateCategoryResponse {
  data: Category
}

export interface UpdateCategoryRequest {
  id: string
  data: {
    name?: string
    slug?: string
    excerpt?: string | null
    image?: string
    storageKey?: string
    altText?: string
    isActive?: boolean
    parentId?: string | null
  }
}

export interface UpdateCategoryResponse {
  data: Category
}

export interface ToggleCategoryStatusRequest {
  id: string
  isActive: boolean
}

export interface ToggleCategoryStatusResponse {
  data: Category
}

export interface DeleteCategoryResponse {
  message: string
  id: string
}

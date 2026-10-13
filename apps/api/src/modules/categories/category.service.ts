import { logger } from "@workspace/logger"
import { categoryRepository } from "./category.repository.js"
import { categoryCache } from "./category.cache.js"
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../utils/errors/index.js"
import type {
  CreateCategoryInput,
  ListCategoriesQuery,
  UpdateCategoryInput,
} from "./category.types.js"

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, "") // Trim - from end
}

class CategoryService {
  async getCategoryTree(includeInactive = false) {
    return await categoryCache.getOrSetCategoryTree(
      includeInactive,
      async () => {
        return await categoryRepository.findTree(includeInactive)
      }
    )
  }

  async getCategories(params: ListCategoriesQuery) {
    return await categoryCache.getOrSetCategoryList(
      params.page ?? 1,
      params.limit ?? 20,
      params.search,
      params.parentId,
      params.isActive,
      async () => {
        return await categoryRepository.findMany(params)
      }
    )
  }

  async getCategoryById(id: string) {
    const category = await categoryCache.getOrSetCategoryById(id, async () => {
      return await categoryRepository.findById(id)
    })

    if (!category) {
      throw new NotFoundError(`Category with ID '${id}' not found`)
    }

    return category
  }

  async getCategoryBySlug(slug: string) {
    const category = await categoryCache.getOrSetCategoryBySlug(
      slug,
      async () => {
        return await categoryRepository.findBySlug(slug)
      }
    )

    if (!category) {
      throw new NotFoundError(`Category with slug '${slug}' not found`)
    }

    return category
  }

  async createCategory(payload: CreateCategoryInput) {
    const slug = payload.slug ? slugify(payload.slug) : slugify(payload.name)

    if (!slug) {
      throw new BadRequestError("Valid category name or slug is required")
    }

    const existingBySlug = await categoryRepository.findBySlug(slug)
    if (existingBySlug) {
      throw new ConflictError(`Category with slug '${slug}' already exists`)
    }

    if (payload.parentId) {
      const parent = await categoryRepository.findById(payload.parentId)
      if (!parent) {
        throw new NotFoundError(
          `Parent category with ID '${payload.parentId}' not found`
        )
      }
    }

    const categoryInput: CreateCategoryInput = {
      name: payload.name,
      slug,
      excerpt: payload.excerpt,
      image: payload.image,
      storageKey: payload.storageKey,
      altText: payload.altText,
      isActive: payload.isActive,
      parentId: payload.parentId,
    }

    const category = await categoryRepository.create(categoryInput)

    await categoryCache.invalidateCategories()

    logger.info("Category created successfully", {
      categoryId: category.id,
      slug: category.slug,
    })

    return category
  }

  async updateCategory(id: string, payload: UpdateCategoryInput) {
    const existing = await categoryRepository.findById(id)
    if (!existing) {
      throw new NotFoundError(`Category with ID '${id}' not found`)
    }

    if (payload.parentId !== undefined && payload.parentId !== null) {
      if (payload.parentId === id) {
        throw new BadRequestError("A category cannot be its own parent")
      }

      const parent = await categoryRepository.findById(payload.parentId)
      if (!parent) {
        throw new NotFoundError(
          `Parent category with ID '${payload.parentId}' not found`
        )
      }

      // Check if new parent is a descendant of current category to prevent cycles
      const newParentAncestors =
        await categoryRepository.getAllCategoryAncestors(payload.parentId)
      if (newParentAncestors.includes(id)) {
        throw new BadRequestError(
          "Cannot set parent: circular hierarchy dependency detected"
        )
      }
    }

    let slug = payload.slug
    if (slug) {
      slug = slugify(slug)
      if (slug !== existing.slug) {
        const existingBySlug = await categoryRepository.findBySlug(slug)
        if (existingBySlug) {
          throw new ConflictError(`Category with slug '${slug}' already exists`)
        }
      }
    }

    const updatePayload: UpdateCategoryInput = {
      ...payload,
      ...(slug ? { slug } : {}),
    }

    const updatedCategory = await categoryRepository.update(id, updatePayload)

    await categoryCache.invalidateCategories()

    logger.info("Category updated successfully", {
      categoryId: id,
      slug: updatedCategory.slug,
    })

    return updatedCategory
  }

  async toggleCategoryStatus(id: string, isActive: boolean) {
    const existing = await categoryRepository.findById(id)
    if (!existing) {
      throw new NotFoundError(`Category with ID '${id}' not found`)
    }

    const updatedCategory = await categoryRepository.update(id, { isActive })

    await categoryCache.invalidateCategories()

    logger.info("Category status toggled", {
      categoryId: id,
      isActive,
    })

    return updatedCategory
  }

  async deleteCategory(id: string) {
    const existing = await categoryRepository.findById(id)
    if (!existing) {
      throw new NotFoundError(`Category with ID '${id}' not found`)
    }

    const childCount = await categoryRepository.countChildren(id)
    if (childCount > 0) {
      throw new BadRequestError(
        `Cannot delete category '${existing.name}' because it contains ${childCount} child categories. Delete or reassign children first.`
      )
    }

    await categoryRepository.delete(id)

    await categoryCache.invalidateCategories()

    logger.info("Category deleted successfully", {
      categoryId: id,
      slug: existing.slug,
    })

    return { message: "Category deleted successfully", id }
  }
}

export const categoryService = new CategoryService()

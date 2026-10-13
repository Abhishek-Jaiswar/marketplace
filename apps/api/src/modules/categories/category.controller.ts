import type { Request, Response, NextFunction } from "express"
import { categoryService } from "./category.service.js"
import {
  createCategorySchema,
  updateCategorySchema,
  toggleCategoryStatusSchema,
  listCategoriesQuerySchema,
  getCategoryTreeQuerySchema,
} from "./category.schema.js"
import { BadRequestError } from "../../utils/errors/index.js"

function getSingleParam(param: string | string[] | undefined): string {
  if (typeof param === "string") return param
  if (Array.isArray(param) && param[0]) return param[0]
  return ""
}

class CategoryController {
  getCategoryTree = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parseResult = getCategoryTreeQuerySchema.safeParse(req.query)
      if (!parseResult.success) {
        const message =
          parseResult.error.issues[0]?.message || "Invalid query parameters"
        throw new BadRequestError(message)
      }

      const tree = await categoryService.getCategoryTree(
        parseResult.data.includeInactive
      )
      res.status(200).json({ data: tree })
    } catch (error) {
      next(error)
    }
  }

  getCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parseResult = listCategoriesQuerySchema.safeParse(req.query)
      if (!parseResult.success) {
        const message =
          parseResult.error.issues[0]?.message || "Invalid query parameters"
        throw new BadRequestError(message)
      }

      const result = await categoryService.getCategories({
        page: parseResult.data.page,
        limit: parseResult.data.limit,
        search: parseResult.data.search,
        parentId: parseResult.data.parentId,
        isActive: parseResult.data.isActive,
      })
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  getCategoryById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = getSingleParam(req.params.id)
      if (!id) {
        throw new BadRequestError("Category ID is required")
      }

      const category = await categoryService.getCategoryById(id)
      res.status(200).json({ data: category })
    } catch (error) {
      next(error)
    }
  }

  getCategoryBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const slug = getSingleParam(req.params.slug)
      if (!slug) {
        throw new BadRequestError("Category slug is required")
      }

      const category = await categoryService.getCategoryBySlug(slug)
      res.status(200).json({ data: category })
    } catch (error) {
      next(error)
    }
  }

  createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parseResult = createCategorySchema.safeParse(req.body)
      if (!parseResult.success) {
        const message =
          parseResult.error.issues[0]?.message || "Invalid category payload"
        throw new BadRequestError(message)
      }

      const category = await categoryService.createCategory({
        name: parseResult.data.name,
        slug: parseResult.data.slug,
        excerpt: parseResult.data.excerpt,
        image: parseResult.data.image,
        storageKey: parseResult.data.storageKey,
        altText: parseResult.data.altText,
        isActive: parseResult.data.isActive,
        parentId: parseResult.data.parentId,
      })
      res.status(201).json({ data: category })
    } catch (error) {
      next(error)
    }
  }

  updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = getSingleParam(req.params.id)
      if (!id) {
        throw new BadRequestError("Category ID is required")
      }

      const parseResult = updateCategorySchema.safeParse(req.body)
      if (!parseResult.success) {
        const message =
          parseResult.error.issues[0]?.message || "Invalid update payload"
        throw new BadRequestError(message)
      }

      const category = await categoryService.updateCategory(id, {
        name: parseResult.data.name,
        slug: parseResult.data.slug,
        excerpt: parseResult.data.excerpt,
        image: parseResult.data.image,
        storageKey: parseResult.data.storageKey,
        altText: parseResult.data.altText,
        isActive: parseResult.data.isActive,
        parentId: parseResult.data.parentId,
      })
      res.status(200).json({ data: category })
    } catch (error) {
      next(error)
    }
  }

  toggleCategoryStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = getSingleParam(req.params.id)
      if (!id) {
        throw new BadRequestError("Category ID is required")
      }

      const parseResult = toggleCategoryStatusSchema.safeParse(req.body)
      if (!parseResult.success) {
        const message =
          parseResult.error.issues[0]?.message || "Invalid status payload"
        throw new BadRequestError(message)
      }

      const category = await categoryService.toggleCategoryStatus(
        id,
        parseResult.data.isActive
      )
      res.status(200).json({ data: category })
    } catch (error) {
      next(error)
    }
  }

  deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = getSingleParam(req.params.id)
      if (!id) {
        throw new BadRequestError("Category ID is required")
      }

      const result = await categoryService.deleteCategory(id)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}

export const categoryController = new CategoryController()

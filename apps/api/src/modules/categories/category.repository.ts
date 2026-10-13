import { db, type Prisma } from "@workspace/db"
import type {
  CreateCategoryInput,
  ListCategoriesQuery,
  UpdateCategoryInput,
} from "./category.types.js"

class CategoryRepository {
  async findById(id: string) {
    return await db.category.findUnique({
      where: { id },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            children: true,
          },
        },
      },
    })
  }

  async findBySlug(slug: string) {
    return await db.category.findUnique({
      where: { slug },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            excerpt: true,
            image: true,
            isActive: true,
          },
        },
      },
    })
  }

  async findMany(params: ListCategoriesQuery) {
    const page = params.page ?? 1
    const limit = params.limit ?? 20
    const skip = (page - 1) * limit

    const where: Prisma.CategoryWhereInput = {}

    if (params.isActive !== undefined) {
      where.isActive = params.isActive
    }

    if (params.parentId !== undefined) {
      where.parentId = params.parentId === "null" || params.parentId === "" ? null : params.parentId
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { slug: { contains: params.search, mode: "insensitive" } },
        { excerpt: { contains: params.search, mode: "insensitive" } },
      ]
    }

    const [items, total] = await Promise.all([
      db.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          parent: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              children: true,
            },
          },
        },
      }),
      db.category.count({ where }),
    ])

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findTree(includeInactive = false) {
    const where: Prisma.CategoryWhereInput = {
      parentId: null,
    }

    if (!includeInactive) {
      where.isActive = true
    }

    const childrenInclude = includeInactive
      ? {
          orderBy: { name: "asc" as const },
          include: {
            children: {
              orderBy: { name: "asc" as const },
            },
          },
        }
      : {
          where: { isActive: true },
          orderBy: { name: "asc" as const },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { name: "asc" as const },
            },
          },
        }

    return await db.category.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        children: childrenInclude,
      },
    })
  }

  async create(data: CreateCategoryInput) {
    return await db.category.create({
      data: {
        name: data.name,
        slug: data.slug!,
        excerpt: data.excerpt ?? null,
        image: data.image,
        storageKey: data.storageKey,
        altText: data.altText,
        isActive: data.isActive ?? true,
        parentId: data.parentId ?? null,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })
  }

  async update(id: string, data: UpdateCategoryInput) {
    const updateData: Prisma.CategoryUpdateInput = {}

    if (data.name !== undefined) updateData.name = data.name
    if (data.slug !== undefined) updateData.slug = data.slug
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt ?? null
    if (data.image !== undefined) updateData.image = data.image
    if (data.storageKey !== undefined) updateData.storageKey = data.storageKey
    if (data.altText !== undefined) updateData.altText = data.altText
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.parentId !== undefined) {
      if (data.parentId === null || data.parentId === "") {
        updateData.parent = { disconnect: true }
      } else {
        updateData.parent = { connect: { id: data.parentId } }
      }
    }

    return await db.category.update({
      where: { id },
      data: updateData,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })
  }

  async delete(id: string) {
    return await db.category.delete({
      where: { id },
    })
  }

  async countChildren(parentId: string): Promise<number> {
    return await db.category.count({
      where: { parentId },
    })
  }

  async getAllCategoryAncestors(id: string): Promise<string[]> {
    const ancestors: string[] = []
    let currentId: string | null = id

    while (currentId) {
      const cat: { parentId: string | null } | null = await db.category.findUnique({
        where: { id: currentId },
        select: { parentId: true },
      })
      if (!cat || !cat.parentId) break
      ancestors.push(cat.parentId)
      currentId = cat.parentId
    }

    return ancestors
  }
}

export const categoryRepository = new CategoryRepository()

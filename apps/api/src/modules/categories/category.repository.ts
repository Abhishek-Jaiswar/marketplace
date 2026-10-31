import { and, db, or, type Condition } from "@workspace/db"
import type {
  CreateCategoryInput,
  ListCategoriesQuery,
  UpdateCategoryInput,
} from "./category.types.js"

type CategoryWhereInput = NonNullable<
  Parameters<typeof db.orm.public.Category.first>[0]
>

class CategoryRepository {
  async findById(id: string) {
    return await db.orm.public.Category
      .include("parent", (parent) => parent.select("id", "name", "slug"))
      .include("children", (children) => children.count())
      .first({ id })
  }

  async findBySlug(slug: string) {
    return await db.orm.public.Category
      .include("parent", (parent) => parent.select("id", "name", "slug"))
      .include("children", (children) =>
        children.select("id", "name", "slug", "excerpt", "image", "isActive"),
      )
      .where({ slug })
      .first()
  }

  async findMany(params: ListCategoriesQuery) {
    const page = params.page ?? 1
    const limit = params.limit ?? 20
    const skip = (page - 1) * limit

    const isActive = params.isActive
    const parentId =
      params.parentId === "null" || params.parentId === ""
        ? null
        : params.parentId
    const search = params.search

    const where: CategoryWhereInput = (category) => {
      const conditions: Condition[] = []

      if (isActive !== undefined) {
        conditions.push(category.isActive.eq(isActive))
      }

      if (parentId !== undefined) {
        conditions.push(
          parentId === null
            ? category.parentId.isNull()
            : category.parentId.eq(parentId),
        )
      }

      if (search) {
        const term = `%${search}%`
        conditions.push(
          or(
            category.name.ilike(term),
            category.slug.ilike(term),
            category.excerpt.ilike(term),
          ),
        )
      }

      return conditions.length > 0 ? and(...conditions) : and()
    }

    const query = db.orm.public.Category
      .where(where)
      .orderBy((category) => category.name.asc())
      .offset(skip)
      .limit(limit)
      .include("parent", (parent) => parent.select("id", "name", "slug"))
      .include("children", (children) => children.count())

    const [items, totals] = await Promise.all([
      query.all(),
      db.orm.public.Category
        .where(where)
        .aggregate((aggregate) => ({ total: aggregate.count() })),
    ])

    return {
      items,
      total: totals.total,
      page,
      limit,
      totalPages: Math.ceil(totals.total / limit),
    }
  }

  async findTree(includeInactive = false) {
    if (includeInactive) {
      return await db.orm.public.Category
        .where((category) => category.parentId.isNull())
        .orderBy((category) => category.name.asc())
        .include("children", (children) =>
          children
            .orderBy((category) => category.name.asc())
            .include("children", (grandchildren) =>
              grandchildren.orderBy((category) => category.name.asc()),
            ),
        )
        .all()
    }

    return await db.orm.public.Category
      .where((category) => category.parentId.isNull())
      .where((category) => category.isActive.eq(true))
      .orderBy((category) => category.name.asc())
      .include("children", (children) =>
        children
          .where((category) => category.isActive.eq(true))
          .orderBy((category) => category.name.asc())
          .include("children", (grandchildren) =>
            grandchildren
              .where((category) => category.isActive.eq(true))
              .orderBy((category) => category.name.asc()),
          ),
      )
      .all()
  }

  async create(data: CreateCategoryInput) {
    return await db.orm.public.Category
      .include("parent", (parent) => parent.select("id", "name", "slug"))
      .create({
        name: data.name,
        slug: data.slug!,
        excerpt: data.excerpt ?? null,
        image: data.image,
        storageKey: data.storageKey,
        altText: data.altText,
        isActive: data.isActive ?? true,
        parentId: data.parentId ?? null,
      })
  }

  async update(id: string, data: UpdateCategoryInput) {
    const parentId = data.parentId

    return await db.orm.public.Category
      .include("parent", (parent) => parent.select("id", "name", "slug"))
      .where({ id })
      .update({
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt ?? null }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.storageKey !== undefined && { storageKey: data.storageKey }),
        ...(data.altText !== undefined && { altText: data.altText }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(parentId !== undefined && {
          parent: (parent) =>
            parentId === null || parentId === ""
              ? parent.disconnect()
              : parent.connect({ id: parentId }),
        }),
      })
  }

  async delete(id: string) {
    return await db.orm.public.Category.where({ id }).delete()
  }

  async countChildren(parentId: string): Promise<number> {
    const result = await db.orm.public.Category
      .where({ parentId })
      .aggregate((aggregate) => ({ count: aggregate.count() }))

    return result.count
  }

  async getAllCategoryAncestors(id: string): Promise<string[]> {
    const ancestors: string[] = []
    let currentId: string | null = id

    while (currentId) {
      const categoryRecord: { parentId: string | null } | null =
        await db.orm.public.Category
          .select("parentId")
          .first({ id: currentId })

      if (!categoryRecord || !categoryRecord.parentId) break
      ancestors.push(categoryRecord.parentId)
      currentId = categoryRecord.parentId
    }

    return ancestors
  }
}

export const categoryRepository = new CategoryRepository()

import { db } from "@workspace/db"
import { Router } from "express"
import { z } from "zod"

import { HttpError } from "../../utils/http-error.js"

const createUserSchema = z.object({
  email: z.email(),
  name: z.string().trim().min(1).max(120).optional(),
})

export const usersRouter: Router = Router()

usersRouter.get("/", async (_request, response, next) => {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    response.status(200).json(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/", async (request, response, next) => {
  try {
    const result = createUserSchema.safeParse(request.body)

    if (!result.success) {
      throw new HttpError(400, result.error.issues[0]?.message ?? "Invalid request body")
    }

    const user = await db.user.create({
      data: {
        email: result.data.email,
        name: result.data.name ?? null,
      },
    })

    response.status(201).json(user)
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      next(new HttpError(409, "A user with this email already exists."))
      return
    }

    next(error)
  }
})

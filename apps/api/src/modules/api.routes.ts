import { Router } from "express"

import { usersRouter } from "./users/users.routes.js"

export const apiRouter: Router = Router()

apiRouter.use("/users", usersRouter)

import { Router, type Request, type Response } from "express"
import { idParamSchema } from "@workspace/contracts/common"
import {
  addCartItemSchema,
  mergeCartSchema,
  updateCartItemSchema,
} from "@workspace/contracts/commerce"

import { requireAuth } from "../../middlewares/auth.middleware.js"
import { getAuthUser, parse } from "../../utils/http/request.js"
import { sendOk } from "../../utils/http/response.js"
import { cartService } from "./cart.service.js"

const router = Router()
router.use(requireAuth)

router.get("/", async (req: Request, res: Response) => {
  sendOk(res, await cartService.getCart(getAuthUser(req).userId))
})

router.post("/items", async (req: Request, res: Response) => {
  sendOk(
    res,
    await cartService.addItem(
      getAuthUser(req).userId,
      parse(addCartItemSchema, req.body)
    )
  )
})

router.patch("/items/:id", async (req: Request, res: Response) => {
  const { id } = parse(idParamSchema, req.params)
  const { quantity } = parse(updateCartItemSchema, req.body)
  sendOk(
    res,
    await cartService.updateItem(getAuthUser(req).userId, id, quantity)
  )
})

router.delete("/items/:id", async (req: Request, res: Response) => {
  const { id } = parse(idParamSchema, req.params)
  sendOk(res, await cartService.removeItem(getAuthUser(req).userId, id))
})

router.post("/merge", async (req: Request, res: Response) => {
  sendOk(
    res,
    await cartService.merge(
      getAuthUser(req).userId,
      parse(mergeCartSchema, req.body)
    )
  )
})

export { router as cartRouter }

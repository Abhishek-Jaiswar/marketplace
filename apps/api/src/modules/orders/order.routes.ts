import { Router, type Request, type Response } from "express"
import {
  checkoutSchema,
  listOrdersQuerySchema,
  orderNumberParamSchema,
} from "@workspace/contracts/commerce"

import { requireAuth } from "../../middlewares/auth.middleware.js"
import { rateLimiter } from "../../middlewares/rate-limiter.middleware.js"
import { getAuthUser, parse } from "../../utils/http/request.js"
import {
  sendCreated,
  sendOk,
  sendPaginated,
} from "../../utils/http/response.js"
import { orderService } from "./order.service.js"

const router = Router()
router.use(requireAuth)

const checkoutLimiter = rateLimiter({
  limit: 20,
  windowSeconds: 60,
  keyPrefix: "checkout",
  keyGenerator: (req) => req.user?.userId ?? req.ip ?? "unknown",
})

router.post(
  "/checkout",
  checkoutLimiter,
  async (req: Request, res: Response) => {
    sendCreated(
      res,
      await orderService.checkout(
        getAuthUser(req).userId,
        parse(checkoutSchema, req.body)
      ),
      "Order placed"
    )
  }
)

router.get("/", async (req: Request, res: Response) => {
  const { page, limit } = parse(listOrdersQuerySchema, req.query)
  sendPaginated(
    res,
    await orderService.listOrders(getAuthUser(req).userId, page, limit)
  )
})

router.get("/:orderNumber", async (req: Request, res: Response) => {
  const { orderNumber } = parse(orderNumberParamSchema, req.params)
  sendOk(res, await orderService.getOrder(getAuthUser(req).userId, orderNumber))
})

export { router as orderRouter }

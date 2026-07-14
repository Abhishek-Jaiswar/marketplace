import { Router } from "express"
import { userRouter } from "./users/user.routes.js"
import { sellerRouter } from "./seller/seller.routes.js"
import { customerRouter } from "./customer/customer.routes.js"

const router = Router()

router.use("/users", userRouter)
router.use("/sellers", sellerRouter)
router.use("/customers", customerRouter)

export { router as apiRouter }

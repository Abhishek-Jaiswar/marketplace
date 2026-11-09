import { Router } from "express"
import { userRouter } from "./users/user.routes.js"
import { sellerRouter } from "./seller/seller.routes.js"
import { customerRouter } from "./customer/customer.routes.js"
import { categoryRouter } from "./categories/category.routes.js"
import { catalogRouter } from "./catalog/catalog.routes.js"
import { inventoryRouter } from "./inventory/inventory.routes.js"
import { cartRouter } from "./cart/cart.routes.js"
import { orderRouter } from "./orders/order.routes.js"

const router = Router()

router.use("/users", userRouter)
router.use("/sellers", sellerRouter)
router.use("/customers", customerRouter)
router.use("/categories", categoryRouter)
router.use("/catalog", catalogRouter)
router.use("/inventory", inventoryRouter)
router.use("/cart", cartRouter)
router.use("/orders", orderRouter)

export { router as apiRouter }

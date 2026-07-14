import { Router } from "express"
import { customerController } from "./customer.controller.js"
import { requireAuth } from "../../middlewares/auth.middleware.js"

const router = Router()

// All routes here require authentication
router.use(requireAuth)

router.get("/profile", customerController.getProfile)
router.patch("/profile", customerController.updateProfile)

router.post("/addresses", customerController.createAddress)
router.put("/addresses/:addressId", customerController.updateAddress)
router.delete("/addresses/:addressId", customerController.deleteAddress)

router.patch("/addresses/:addressId/default-shipping", customerController.setDefaultShipping)
router.patch("/addresses/:addressId/default-billing", customerController.setDefaultBilling)

export { router as customerRouter }

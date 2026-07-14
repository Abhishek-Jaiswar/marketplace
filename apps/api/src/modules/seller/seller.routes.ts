import { Router } from "express"
import multer from "multer"
import { sellerController } from "./seller.controller.js"
import { requireAuth } from "../../middlewares/auth.middleware.js"
import { requireRole } from "../../middlewares/role.middleware.js"
import { rateLimiter } from "../../middlewares/rate-limiter.middleware.js"

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
})

const registerLimiter = rateLimiter({
  limit: 5,
  windowSeconds: 900, // 15 minutes
  keyPrefix: "seller-register",
})

const uploadLimiter = rateLimiter({
  limit: 10,
  windowSeconds: 300, // 5 minutes
  keyPrefix: "seller-upload",
})

// Public routes
router.post("/register", registerLimiter, sellerController.register)

// Authenticated seller onboarding & profile routes
router.use(requireAuth)

router.post("/onboard", sellerController.onboard)
router.get("/me", sellerController.getMe)
router.put("/profile", sellerController.updateProfile)
router.put("/store", sellerController.updateStore)
router.post("/bank-accounts", sellerController.addBankAccount)
router.post(
  "/documents",
  uploadLimiter,
  upload.single("file"),
  sellerController.uploadDocument
)
router.post("/submit", sellerController.submit)

// Admin verification & list routes
router.get("/", requireRole(["ADMIN"]), sellerController.getSellers)
router.post("/:sellerId/verify", requireRole(["ADMIN"]), sellerController.verifySeller)

export { router as sellerRouter }

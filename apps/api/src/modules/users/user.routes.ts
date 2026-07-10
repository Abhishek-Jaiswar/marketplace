import { Router } from "express"
import { userController } from "./user.controller.js"
import { rateLimiter } from "../../middlewares/rate-limiter.middleware.js"
import { requireAuth } from "../../middlewares/auth.middleware.js"
import { requireRole } from "../../middlewares/role.middleware.js"

const router = Router()

const registerLimiter = rateLimiter({
  limit: 5,
  windowSeconds: 900, // 15 minutes
  keyPrefix: "register",
})

const verifyLimiter = rateLimiter({
  limit: 5,
  windowSeconds: 600, // 10 minutes
  keyPrefix: "verify-otp",
  keyGenerator: (req) => {
    return req.body.email ? String(req.body.email).trim().toLowerCase() : req.ip || "unknown"
  },
})

const loginLimiter = rateLimiter({
  limit: 5,
  windowSeconds: 600, // 10 minutes
  keyPrefix: "login",
  keyGenerator: (req) => {
    return req.body.email ? String(req.body.email).trim().toLowerCase() : req.ip || "unknown"
  },
})

const resendOtpLimiter = rateLimiter({
  limit: 3,
  windowSeconds: 600, // 10 minutes
  keyPrefix: "resend-otp",
  keyGenerator: (req) => {
    return req.body.email ? String(req.body.email).trim().toLowerCase() : req.ip || "unknown"
  },
})

const forgotPasswordLimiter = rateLimiter({
  limit: 3,
  windowSeconds: 900, // 15 minutes
  keyPrefix: "forgot-password",
  keyGenerator: (req) => {
    return req.body.email ? String(req.body.email).trim().toLowerCase() : req.ip || "unknown"
  },
})

const resetPasswordLimiter = rateLimiter({
  limit: 5,
  windowSeconds: 900, // 15 minutes
  keyPrefix: "reset-password",
  keyGenerator: (req) => {
    return req.body.email ? String(req.body.email).trim().toLowerCase() : req.ip || "unknown"
  },
})

router.post("/register", registerLimiter, userController.register)
router.post("/verify", verifyLimiter, userController.verify)
router.post("/login", loginLimiter, userController.login)
router.post("/logout", userController.logout)
router.post("/refresh", userController.refresh)
router.post("/resend-otp", resendOtpLimiter, userController.resendOtp)
router.post("/forgot-password", forgotPasswordLimiter, userController.forgotPassword)
router.post("/reset-password", resetPasswordLimiter, userController.resetPassword)
router.get("/me", requireAuth, userController.getMe)
router.get("/", requireAuth, requireRole(["ADMIN"]), userController.getUsers)

export { router as userRouter }

import { logger } from "@workspace/logger"
import { Env } from "../../config/env.config.js"
import nodemailer from "nodemailer"
import { verifyEmailOtpTemplate } from "./templates/email-otp.template.js"
import { resetPasswordOtpTemplate } from "./templates/reset-password.template.js"

class MailService {
  private transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: Env.MAIL_USER,
        pass: Env.MAIL_PASS,
      },
    })
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    attachments?: nodemailer.SendMailOptions["attachments"]
  ) {
    try {
      const info = await this.transporter.sendMail({
        from: `"CBS Marketplace" <${Env.MAIL_USER}>`,
        to,
        subject,
        html,
        attachments,
      })

      return info
    } catch (error) {
      logger.error("Email transport error: ", error)
      throw new Error("Failed to send email", { cause: error })
    }
  }

  async sendOtpEmail(to: string, otp: string) {
    return this.sendEmail(
      to,
      "Verify Your Email - CBS Marketplace",
      verifyEmailOtpTemplate(otp)
    )
  }

  async sendResetPasswordOtp(to: string, otp: string) {
    return this.sendEmail(
      to,
      "Reset Your Password - CBS Marketplace",
      resetPasswordOtpTemplate(otp)
    )
  }
}

export const mailService = new MailService()

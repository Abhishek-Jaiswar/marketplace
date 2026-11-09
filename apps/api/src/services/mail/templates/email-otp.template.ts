import { marketplaceName } from "../../../config/env.config.js"

export function verifyEmailOtpTemplate(otp: string): string {
  return `Hi,

Your verification code for ${marketplaceName} is:

${otp}

This code will expire in 10 minutes.

If you didn't request this code, you can safely ignore this email.

Thanks,
${marketplaceName}`
}

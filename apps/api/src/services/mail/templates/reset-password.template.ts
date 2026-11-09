import { marketplaceName } from "../../../config/env.config.js"

export function resetPasswordOtpTemplate(otp: string): string {
  return `Hi,

Your password reset code for ${marketplaceName} is:

${otp}

This code will expire in 10 minutes.

If you didn't request a password reset, you can safely ignore this email.

Thanks,
${marketplaceName}`
}

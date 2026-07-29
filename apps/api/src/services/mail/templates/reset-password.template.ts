export function resetPasswordOtpTemplate(otp: string): string {
  return `Hi,

Your password reset code for CBS Marketplace is:

${otp}

This code will expire in 10 minutes.

If you didn't request a password reset, you can safely ignore this email.

Thanks,
CBS Marketplace`
}

